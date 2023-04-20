from pyspark.ml.feature import VectorAssembler
from pyspark.ml.regression import LinearRegression
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("Read JSON from GCS") \
    .config("spark.hadoop.fs.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFileSystem") \
    .config("spark.hadoop.fs.AbstractFileSystem.gs.impl", "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFS") \
    .config("spark.hadoop.google.cloud.auth.service.account.enable", "true") \
    .config("spark.hadoop.google.cloud.auth.service.account.json.keyfile", "./credenciales/keyfile.json") \
    .getOrCreate()
    
# Load data into a PySpark DataFrame
data = spark.read.csv("data.csv", header=True, inferSchema=True)

# Split data into training and testing sets
train_data, test_data = data.randomSplit([0.7, 0.3], seed=123)

# Create VectorAssembler to combine features into a single feature vector
assembler = VectorAssembler(inputCols=["feature1", "feature2", "feature3"], outputCol="features")

# Transform the training and testing data
train_data = assembler.transform(train_data)
test_data = assembler.transform(test_data)

# Select the label column and rename it to "label"
train_data = train_data.select(train_data["max_value"].alias("label"), train_data["features"])
test_data = test_data.select(test_data["max_value"].alias("label"), test_data["features"])

# Instantiate a Linear Regression model
lr = LinearRegression(maxIter=10, regParam=0.3, elasticNetParam=0.8)

# Train the model on the training data
lr_model = lr.fit(train_data)

# Use the trained model to predict the maximum values for the testing data
predictions = lr_model.transform(test_data)

# Evaluate the performance of the model
evaluator = RegressionEvaluator(labelCol="label", predictionCol="prediction", metricName="rmse")
rmse = evaluator.evaluate(predictions)
print("Root Mean Squared Error (RMSE) = %g" % rmse)
