const cheerio = require("cheerio");
var request = require('request');
var fs = require('fs');
const axios = require("axios");

const url = "https://cocina-casera.com/mx/recetas-de-guisos-mexicanos/"
const linksArray = [];
const recipesArray = [];

async function getGenre(){
    try{
        const response = await axios.get(url);
        const $=cheerio.load(response.data)
        const links = $('figure.sf-entry-featured-media a').map((index, element) => {
            return $(element).attr('href');
          }).get();
        return links
          //console.log(links);

    }
    catch(error){
        //console.error(error);
    }
}

async function acces_receta(link_url){
    try{

        const response = await axios.get(link_url);
        const $=cheerio.load(response.data)
        const h1Text = $('h1.sf-entry-title[itemprop="headline"]').text();
        //console.log(h1Text);
        
        const recetas = $('div.entry-content > ul > li');
        const recipeArray = [];
        recetas.each(function() {
        //console.log($(this).text());
        recipeArray.push($(this).text());
        });

        const recipeObj = {
            title: h1Text,
            ingredients: recipeArray,
          };

        recipesArray.push(recipeObj);
    }
    catch(error){
        //c
        console.error(error);
    }
}

const res = async () => {
    const links = await getGenre();
    for (let i = 0; i < links.length; i++) {
        console.log(links[i]);
        await acces_receta(links[i]);
      }
    
    const json = JSON.stringify(recipesArray);
      fs.writeFile("recipes.json", json, "utf8", (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("JSON file created");
        }
      });
  }

  module.exports = res()


