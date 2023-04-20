const cheerio = require("cheerio");
const fs = require('fs');
const axios = require("axios");

/**
 * Obtiene el listado de recetas de la página web
 */
const url = "https://cocina-casera.com/mx/recetas-de-guisos-mexicanos/";
const ingredientsJson = [];
const ingredientsCsv = ['Receta,Personas,Cantidad,Unidad,Ingrediente'];

async function getGenre() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const links = $('figure.sf-entry-featured-media a')
      .map((index, element) => $(element).attr('href'))
      .get();
    return links;
  } catch (error) {
    console.error(error);
  }
}

async function accessRecipe(linkUrl) {
  try {
    const response = await axios.get(linkUrl);
    const $ = cheerio.load(response.data);

    const recipeName = $('h1.sf-entry-title[itemprop="headline"]').text();
    const peopleAmount = $('div.entry-content > h2:first-of-type')
      .text()
      .match(/\d+/); // Número de personas que rinde la receta
    const ingredients = [];

    $('div.entry-content > ul > li').each(function() {
      let ingrediente = $(this).text();
      // Caso especial, al gusto
      if (ingrediente.includes('al gusto')) {
        ingrediente = ingrediente.replace('al gusto', '1 gusto')
      }
      // Patron para separar la cantidad de ingrediente, unidad de medida y el nombre
      const pattern = /^([\w\s]+) - ((\d+\/\d+|\d+\.\d+|\d+))(\s+(de\s+)?(\w+))?(\s+\-\s+(\w+))?$/
      const match = ingrediente.match(pattern);
      if (match) {
        const name = match[1].trim(); // Extrae el nombre del ingrediente
        const quantity = match[2]; // Extrae la cantidad y conviértela en número
        const unit = match[6]; // Extrae la unidad de medida
        ingredients.push({
          "Nombre": name,
          "Cantidad": quantity,
          "Unidad": unit
        }); // Agrega el ingrediente al arreglo
        ingredientsCsv.push(`${recipeName},${peopleAmount},${quantity},${unit},${name}`); // Agrega el ingrediente al arreglo
      }
    });
    // Crea un objeto con la información de la receta para generar el json
    const recipeObj = {
      "Receta": recipeName,
      "Personas": peopleAmount ? parseInt(peopleAmount[0]) : 0,
      "Ingredientes": ingredients,
    };

    ingredientsJson.push(recipeObj);
  } catch (error) {
    console.error(error);
  }
}

async function scrapeRecipes() {
  const links = await getGenre();
  for (let i = 0; i < links.length; i++) {
    await accessRecipe(links[i]);
  }
  // Guarda el arreglo de recetas en un archivo CSV
  fs.writeFile("recipes.csv", ingredientsCsv.join('\n'), "utf8", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("CSV file created");
    }
  });

  // Guarda el arreglo de recetas en un archivo JSON
  const json = JSON.stringify(ingredientsJson, null, 2);
  fs.writeFile("recipes.json", json, "utf8", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("JSON file created");
    }
  });
}

module.exports = scrapeRecipes();