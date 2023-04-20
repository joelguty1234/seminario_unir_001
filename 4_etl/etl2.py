from pyspark.sql import SparkSession
from pyspark.sql.functions import split,col,explode,trim,regexp_replace,when,from_json
from pyspark.sql.types import ArrayType, StructField, StringType, StructType

# create a SparkSession
spark = SparkSession.builder \
    .appName("Read JSON from GCS") \
    .config("spark.hadoop.fs.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFileSystem") \
    .config("spark.hadoop.fs.AbstractFileSystem.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFS") \
    .config("spark.hadoop.google.cloud.auth.service.account.enable", "true") \
    .config("spark.hadoop.google.cloud.auth.service.account.json.keyfile", "./credenciales/keyfile.json") \
    .getOrCreate()

file_path = "gs://test_yaku_001/seminario_001/final_productos.json"

df = spark.read.option("multiline",True) \
        .option("encoding", "ISO-8859-1") \
        .json(file_path)

df = df.select(
    trim(col("Products")).alias("Products"),
    trim(col("Autoservicio_bajo")).alias("Autoservicio_bajo"),
    trim(col("Autoservicio_alto")).alias("Autoservicio_alto"),
    trim(col("Mercado_ruedas_bajo")).alias("Mercado_ruedas_bajo"),
    trim(col("Mercado_ruedas_alto")).alias("Mercado_ruedas_alto"),
    trim(col("Mercado_publico_bajo")).alias("Mercado_publico_bajo"),
    trim(col("Mercado_publico_alto")).alias("Mercado_publico_alto"),
    trim(col("Ceda_bajo")).alias("Ceda_bajo"),
    trim(col("Ceda_alto")).alias("Ceda_alto"),
    trim(col("Medida")).alias("Medida")
)

df = df.select(
    trim(col("Products")).alias("Products"),
    split(df["Autoservicio_bajo"], "\\ ")[0].alias("Autoservicio_bajo"),
    split(df["Autoservicio_alto"], "\\ ")[0].alias("Autoservicio_alto"),
    split(df["Mercado_ruedas_bajo"], "\\ ")[0].alias("Mercado_ruedas_bajo"),
    split(df["Mercado_ruedas_alto"], "\\ ")[0].alias("Mercado_ruedas_alto"),
    split(df["Mercado_publico_bajo"], "\\ ")[0].alias("Mercado_publico_bajo"),
    split(df["Mercado_publico_alto"], "\\ ")[0].alias("Mercado_publico_alto"),
    split(df["Ceda_bajo"], "\\ ")[0].alias("Ceda_bajo"),
    split(df["Ceda_alto"], "\\ ")[0].alias("Ceda_alto"),
    trim(col("Medida")).alias("Medida")
).filter(col("Products") != "Canales de Abasto") \
.filter(col("Products") != "")


df.printSchema()
df.show()

spark.stop()