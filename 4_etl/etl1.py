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
    trim(col("Receta")).alias("Receta"),
    trim(col("Personas")).cast("int").alias("Personas"),
    explode(col("Ingredientes")).alias("Ingredientes"),
)

df = df.select(
    trim(col("Receta")).alias("Receta"),
    trim(col("Personas")).cast("int").alias("Personas"),
    trim(col("Ingredientes.Nombre")).alias("Ingrediente"),
    trim(col("Ingredientes.Cantidad")).alias("Cantidad"),
    trim(col("Ingredientes.Unidad")).alias("Unidad")
)

df = df.select(
    col("Receta"),
    col("Personas"),
    col("Ingrediente"),
    col("Cantidad"),
    col("Unidad"),
    split(df["Cantidad"], "\\/")[0].cast("int").alias("entero"),
    split(df["Cantidad"], "\\/")[1].cast("int").alias("decimal"),
)

df = df.fillna(0, subset=["entero","decimal"])


df = df.select(
    col("Receta"),
    col("Personas"),
    col("Ingrediente"),
    when(
     col("decimal")>0,(col("entero")/col("decimal"))
                 ).otherwise(col("entero")).cast(DecimalType(10, 2)).alias("monto"),
    col("Unidad")
)


# show the first 20 rows of the DataFrame
df.printSchema()
df.show(80)

spark.stop()