import tensorflow as tf
import pandas as pd
from pymongo import MongoClient
import numpy as np
from datetime import datetime, timedelta
import csv

# connect to mongodb
client = MongoClient('mongodb://localhost:27017/')
db = client['tournament_ratings']
# collection = db['tournament_ratings']

# Reading the entire data to be processed
data = pd.read_csv('data_final.csv')

# Load the SavedModel
model = tf.keras.models.load_model("keras_load_model")

ratings = []
tournaments = []

first_row = data.head(1)
tournament_id = first_row["tournamentId"]

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


def predict(rating_a, rating_b, rating_diff, team_A_wins):
    rating_a = rating_a/800
    rating_b = rating_b/800
    rating_diff = rating_diff/800
    state = [rating_a, rating_b, rating_diff, team_A_wins]
    q_values = model.predict(np.array([state]))
    action = np.argmax(q_values)
    fluctuation = ((rating_diff * 800) / ACTIONS[action]) + 20
    return fluctuation


def get_rating_and_index(team_id, ratings_arr):
    for index_teams, teams in enumerate(ratings_arr):
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

    tournament_id = int(row.tournamentId)

    if tournament_id in tournaments:
        continue
    tournaments.append(tournament_id)

    # We will only look at matches that were held between start_date and end_date. The gap between
    # them is of six months.
    end_date = int(row.startDate)
    input_date = datetime.strptime(str(row.startDate), "%Y%m%d")
    # start date which is date of six months ago
    start_date = input_date - timedelta(days=30 * 6)
    start_date = int(start_date.strftime("%Y%m%d"))

    inner_count = 0
    for inner_row in data.itertuples():
        inner_count = inner_count+1
        print(f'inner_count: {inner_count}')

        curr_date = int(inner_row.startDate)

        if (curr_date >= start_date) and (curr_date < end_date):

            ratings = []
            rating_a, index_a = get_rating_and_index(inner_row.teamA, ratings)
            rating_b, index_b = get_rating_and_index(inner_row.teamB, ratings)

            if rating_a > rating_b:
                rating_diff = rating_a - rating_b
            else:
                rating_diff = rating_b - rating_a

            fluctuation = predict(rating_a, rating_b, rating_diff, inner_row.result)

            if inner_row.result == 1:
                ratings[index_a][1] += fluctuation
                ratings[index_b][1] -= fluctuation
            else:
                ratings[index_a][1] -= fluctuation
                ratings[index_b][1] += fluctuation

    collection = db[str(tournament_id)]
    for team in ratings:
        document = {
            "team_id": str(team[0]),
            "rating": team[1]
        }
        collection.insert_one(document)
    print(ratings)

"""
# Insert the final ratings into a ratings.csv file
with open("ratings.csv", 'w', newline='') as csv_file:
    writer = csv.writer(csv_file)
    writer.writerows(ratings)
"""