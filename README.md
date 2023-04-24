# Seminario de Innovación en Inteligencia Artificial
## 1. Obtención de datos de precios de la canasta básica
Proceso para el uso inteligente de recursos gastronómicos en comedores comunitarios de la **Ciudad de México** mediante modelos de Machine Learning y técnicas de recolección de datos.

### 1.1. Prerequisitos
* `Python >= 3.6`
* `NodeJS >= 8.9.4`
* `poppler gs tesseract` (para el uso de pdf-text-extract) [¿Cómo lo instalo?](https://github.com/nisaacson/pdf-extract)

### 1.2. Instalación
#### 1.2.1. Clonar el repositorio
```
git clone https://github.com/joelguty1234/seminario_unir_001.git
```

#### 1.2.2. Instalar dependencias en cada directorio
```
npm install
```
#### 1.2.3. Instalar y configurar **Apache Spark** para el proyecto `4_etl`
1.  Instala Python y Java en tu computadora.
2.  Descarga la versión de Apache Spark que deseas instalar.
3.  Extrae el archivo descargado de Apache Spark en tu computadora y colócalo en un directorio de tu elección.
4.  Establece la variable de entorno PYSPARK_PYTHON en la ruta de acceso al ejecutable de Python que deseas utilizar para ejecutar PySpark.
5.  Establece la variable de entorno SPARK_HOME en la ruta de acceso al directorio de Apache Spark que has descargado.
6. En la terminal, ejecuta el siguiente comando:
```
$SPARK_HOME/bin/spark-submit --master local[*] etl1.py > log.txt
```

## 2. Uso de la aplicación
### 2.1. Obtener los precios de la canasta básica
Por medio de la página de la **SEDECO** se obtienen los precios de los insumos básicos. Fuente: [Precios Canasta Básica](https://www.sedeco.cdmx.gob.mx/servicios/servicio/seguimiento-de-precios-de-la-canasta-basica).

Este script obtiene los datos en un CSV con el siguiente formato:

| Fecha  | Producto | Unidad de Medida | Precio Mínimo | Precio Máximo |
| ---------- |:----------:|:--------:|:--------:|:--------:|
| 2022-01-06 | Aguacate Hass|1Kg|45.00|75.00|
| 2022-01-06 | Limón con semilla|1Kg|20.00|30.00|
| 2022-01-06 | Guayaba |1Kg|10.00|20.00|
| 2022-01-06 | Manzana Golden |1Kg|40.00|50.00|
| 2022-01-06 | Naranja mediana |1Kg|6.00|10.00|

Para correr el script se tiene ubicar en el directorio `1_precios_canasta` con los siguiente comandos

#### 2.1.1. Descarga PDF's
Descarga un array de enlaces en el directorio local
```
npm run download
```
#### 2.1.2. Genera CSV
Lee el directorio `pdfs`generado por el comando `npm run download` para posteriormente generar el CSV.
```
npm run csv
```
#### 2.1.3. Descarga y Genera el CSV
Se ejecutan los primeros dos comandos consecutivamente.
```
npm run prod
```
### 2.2. Obtiene un ejemplo de recetas
Útil para tener un set de datos que conformen un platillo. Contiene información de los ingredientes: cantidad, número de personas y unidad de medida.

Para ejecutarlo, es necesario correr el siguiente comando:
```
node load_recetas.js
```
Como resultado genera dos archivos para adaptarlo en un sistema de front-end:
* recipes.json
* recipes.csv

### 3.1 Modelo de predicción
Dentro de la carpeta `5_model_generator` se encuentran los archivos que hacen uso de los datos que se procesaron en la etapa de recolección de datos.

Descripción del notebook `model_predictor.ipynb`:
1.  Contiene el uso del historial de precios.
2.  Preprocesa el dataset previo al entrenamiento.
3. Aplica un modelo de series de tiempo para el entrenamiento.
4. Grafica el histórico y las predicciones.
5. Muestra ejemplos del comportamiento de precios de algunos ingredientes.