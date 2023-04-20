from pyspark.sql import SparkSession
from pyspark.sql.functions import split,col,explode,trim,regexp_replace,when
from pyspark.sql.types import DecimalType

spark = SparkSession.builder \
    .appName("Read JSON from GCS") \
    .config("spark.hadoop.fs.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFileSystem") \
    .config("spark.hadoop.fs.AbstractFileSystem.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFS") \
    .config("spark.hadoop.google.cloud.auth.service.account.enable", "true") \
    .config("spark.hadoop.google.cloud.auth.service.account.json.keyfile", "./credenciales/keyfile.json") \
    .getOrCreate()

file_path = "gs://test_yaku_001/seminario_001/recipes.json"

df = spark.read.option("multiline",True) \
        .option("encoding", "ISO-8859-1") \
        .json(file_path)

df = df.select(
                split(df["title"], "\\.")[0].alias("receta_name"),
                explode(df["ingredients"]).alias("ingredients")
)

df = df.select(
                col("receta_name"),
                split(df["ingredients"], "\\-")[0].alias("ingredients_name"),
                split(df["ingredients"], "\\-")[1].alias("ingredients_value")
)

df = df.select(
                trim(col("receta_name")).alias("receta_name"),
                trim(col("ingredients_name")).alias("ingredients_name"),
                trim(col("ingredients_value")).alias("ingredients_value"),
)

df = df.select(
                col("receta_name"),
                col("ingredients_name"),
                split(df["ingredients_value"], "\\ ")[0].alias("ingredients_value"),
                split(df["ingredients_value"], "\\ ")[1].alias("ingredients_peso")
)

df = df.select(
                col("receta_name"),
                col("ingredients_name"),
                trim(col("ingredients_value")).alias("ingredients_value"),
                trim(col("ingredients_peso")).alias("ingredients_peso"),
                split(df["ingredients_value"], "\\/")[0].alias("entero"),
                split(df["ingredients_value"], "\\/")[1].alias("decimal"),
)

df = df.select(
                col("receta_name"),
                col("ingredients_name"),
                col("ingredients_value"),
                trim(col("ingredients_peso")).alias("ingredients_peso"),
                trim(col("entero")).cast("int").alias("entero"),
                trim(col("decimal")).cast("int").alias("decimal"),
)

df = df.fillna(0, subset=["entero","decimal"])

df = df.select(
                col("receta_name"),
                col("ingredients_name"),
                when(
                    col("decimal")>0,(col("entero")/col("decimal"))
                ).otherwise(col("entero")).cast(DecimalType(10, 2)).alias("monto"),
                when(
                    col("ingredients_peso") == "de",
                    "pieza")
                .when(
                    col("ingredients_peso").like("piez%"),
                    "unidad")
                .otherwise(col("ingredients_peso")).alias("ingredients_peso")
)

df = df.select(
    col("receta_name"),
    col("ingredients_name"),
    col("monto"),
    when(col("ingredients_peso") == "pieza","unidad")
    .when(col("ingredients_peso") == "latas","unidad")
    .when(col("ingredients_peso") == "lata","unidad")
    .when(col("ingredients_peso") == "ramas","unidad")
    .when(col("ingredients_peso") == "paquetes","unidad")
    .when(col("ingredients_peso") == "gusto","cucharadita")
    .otherwise(col("ingredients_peso")).alias("ingredients_peso")
)


# show the first 20 rows of the DataFrame
df.printSchema()
df.show(80)

spark.stop()