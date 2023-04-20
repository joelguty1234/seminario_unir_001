from pyspark.sql import SparkSession
from pyspark.sql.functions import split,col,explode,trim,rand,when
from pyspark.sql.types import StructField,FloatType,StructType
import random

spark = SparkSession.builder \
    .appName("Random") \
    .config("spark.hadoop.fs.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFileSystem") \
    .config("spark.hadoop.fs.AbstractFileSystem.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFS") \
    .config("spark.hadoop.google.cloud.auth.service.account.enable", "true") \
    .config("spark.hadoop.google.cloud.auth.service.account.json.keyfile", "./credenciales/keyfile.json") \
    .getOrCreate()

schema = StructType([
    StructField("Arroz", FloatType(), True),
    StructField("Papa", FloatType(), True),
    StructField("Chile", FloatType(), True),
    StructField("Cebolla", FloatType(), True),
    StructField("Zanahoria", FloatType(), True)
])
# Generate random data
data = [(random.uniform(0, 1)*100, random.uniform(0, 1)*100, 
         random.uniform(0, 1)*100, random.uniform(0, 1)*100, 
         random.uniform(0, 1)*100) for i in range(1000)]

# Create a PySpark DataFrame from the data and schema
df = spark.createDataFrame(data, schema)
# show the first 20 rows of the DataFrame
df.printSchema()
df.show(20)

spark.stop()