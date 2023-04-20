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




df.printSchema()
df.show()

spark.stop()