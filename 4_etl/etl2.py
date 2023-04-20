from pyspark.sql import SparkSession
from pyspark.sql.functions import split,col,explode,trim,regexp_replace,when
# create a SparkSession
spark = SparkSession.builder \
    .appName("Read JSON from GCS") \
    .config("spark.hadoop.fs.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFileSystem") \
    .config("spark.hadoop.fs.AbstractFileSystem.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFS") \
    .config("spark.hadoop.google.cloud.auth.service.account.enable", "true") \
    .config("spark.hadoop.google.cloud.auth.service.account.json.keyfile", "./credenciales/keyfile.json") \
    .getOrCreate()

file_path = "gs://test_yaku_001/seminario_001/16_de_Abril_de_2023.json"

df = spark.read.option("multiline",True) \
        .option("encoding", "ISO-8859-1") \
        .json(file_path)


# show the first 20 rows of the DataFrame
df.printSchema()
df.show(20)

spark.stop()