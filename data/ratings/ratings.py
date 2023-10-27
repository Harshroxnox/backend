# Aim: This file basically runs the model against all the final processed data in the data_final.csv
# file to get the final ratings of all teams in the ratings array and then exports it to a csv
# file named ratings.csv
import numpy as np
import tensorflow as tf
import pandas as pd
import csv

# Reading the entire data to be processed
data = pd.read_csv('data_final.csv')

# Load the SavedModel
model = tf.keras.models.load_model("keras_load_model")

ratings = []

# Initialize actions which is necessary for working of model
ACTIONS = [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
]


# This function takes ratings of A, B, difference and which team won and returns the fluctuations
# of ratings that must be done.
def predict(rating_a, rating_b, rating_diff, team_A_wins):
    rating_a = rating_a/800
    rating_b = rating_b/800
    rating_diff = rating_diff/800
    state = [rating_a, rating_b, rating_diff, team_A_wins]
    q_values = model.predict(np.array([state]))
    action = np.argmax(q_values)
    fluctuation = ((rating_diff * 800) / ACTIONS[action]) + 20
    return fluctuation


# Searches for rating and index of a particular team in ratings arr given its id.
def get_rating_and_index(team_id):
    for index_teams, teams in enumerate(ratings):
        if teams[0] == team_id:
            return teams[1], index_teams
    # Team not found, add a new entry
    new_team = [team_id, 400]
    ratings.append(new_team)
    return 400, len(ratings) - 1


count = 0
for row in data.itertuples():
    count = count+1
    print(f'count: {count}')

    print(ratings)
    print(" ")
    # Extract the parameters for current row
    rating_a, index_a = get_rating_and_index(row.teamA)
    rating_b, index_b = get_rating_and_index(row.teamB)

    if rating_a > rating_b:
        rating_diff = rating_a - rating_b
    else:
        rating_diff = rating_b - rating_a

    # Get the fluctuation of the model
    fluctuation = predict(rating_a, rating_b, rating_diff, row.result)

    # Update the ratings in the ratings arr
    if row.result == 1:
        ratings[index_a][1] += fluctuation
        ratings[index_b][1] -= fluctuation
    else:
        ratings[index_a][1] -= fluctuation
        ratings[index_b][1] += fluctuation

# Extract all the ratings of teams from the ratings arr into the ratings.csv file

with open("ratings.csv", 'w', newline='') as csv_file:
    writer = csv.writer(csv_file)
    writer.writerows(ratings)

