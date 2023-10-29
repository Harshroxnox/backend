# Aim: This file iterates through the data in the data_final.csv file and for every single unique
# tournament found in that file it takes into account the data of previous six months from the
# starting of the tournament and returns the ranking of teams based on the previous six months
# data.
# It stores all the rankings data for each tournament in a mongodb database(mongodb instance must
# be running) the db name is tournament_ratings and in their collections will be named after the
# tournament Id for which they will contain the rankings of the teams.
import tensorflow as tf
import pandas as pd
from pymongo import MongoClient
import numpy as np
from datetime import datetime, timedelta

# connect to mongodb. The name of database is going to be tournament_ratings which will be
# automatically created on running this script provided the mongod service is running on linux
# server
client = MongoClient('mongodb://localhost:27017/')
db = client['tournament_ratings']

# Reading the entire data to be processed
data = pd.read_csv('data_final.csv')

# Load the SavedModel
model = tf.keras.models.load_model("keras_load_model")

# Initialize ratings, tournaments(for keeping track of teams ratings and the tournaments we have
# already covered)
ratings = []
tournaments = []

# Gets tournament Id of first row
first_row = data.head(1)
tournament_id = first_row["tournamentId"]

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
fluctuations_arr = []
for row in data.itertuples():
    count = count+1
    print(f'count: {count}')

    tournament_id = int(row.tournamentId)

    # If tournament already covered skip
    if tournament_id in tournaments:
        continue
    tournaments.append(tournament_id)

    # We will only look at matches that were held between start_date and end_date. The gap between
    # them is of six months.
    end_date = int(row.startDate)
    input_date = datetime.strptime(str(row.startDate), "%Y%m%d")
    # start date which is date of six months ago
    start_date = input_date - timedelta(days=30 * 6)
    start_date = start_date.strftime("%Y%m%d")
    start_date = int(start_date)
    # Reinitialize ratings arr
    ratings = []

    inner_count = 0
    for inner_row in data.itertuples():
        inner_count = inner_count+1
        curr_date = int(inner_row.startDate)
        print(f'inner_count: {inner_count}')

        # Only consider that row if curr_date lies between start and end date.
        if start_date <= curr_date < end_date:
            # Extract all the parameters
            rating_a, index_a = get_rating_and_index(inner_row.teamA)
            rating_b, index_b = get_rating_and_index(inner_row.teamB)

            if rating_a > rating_b:
                rating_diff = rating_a - rating_b
            else:
                rating_diff = rating_b - rating_a

            # Get the fluctuation of the model
            found_fluctuation = 0
            for dictionary in fluctuations_arr:
                if dictionary["inner_count"] == inner_count:
                    fluctuation = dictionary["fluctuation"]
                    found_fluctuation = 1
                    print("found_fluctuation")

            if found_fluctuation == 0:
                fluctuation = predict(rating_a, rating_b, rating_diff, inner_row.result)
                new_fluctuation = {
                    "inner_count": inner_count,
                    "fluctuation": fluctuation
                }
                fluctuations_arr.append(new_fluctuation)

            # Update the ratings in the ratings arr
            if inner_row.result == 1:
                ratings[index_a][1] += fluctuation
                ratings[index_b][1] -= fluctuation
            else:
                ratings[index_a][1] -= fluctuation
                ratings[index_b][1] += fluctuation

    # Finally insert all ratings of teams in ratings arr in a mongodb collection
    collection = db[str(tournament_id)]
    for team in ratings:
        document = {
            "team_id": str(team[0]),
            "rating": team[1]
        }
        collection.insert_one(document)
    print(ratings)

