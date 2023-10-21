import pandas as pd
from pymongo import MongoClient

# Read CSV file into a pandas DataFrame
data = pd.read_csv('team_ratings.csv')
print(data.dtypes)


# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['backend_db']
collection = db['team_ratings']

# Convert DataFrame to MongoDB documents and insert into the collection
data_dict = data.to_dict(orient='records')
collection.insert_many(data_dict)

# Close the MongoDB connection
client.close()
