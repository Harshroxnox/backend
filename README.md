# Backend API for Ranking-Model with Ranking routes
# API Guide
We have developed three API routes namely `/global_rankings` , `/team_rankings` and `/tournament_rankings`. The format is as follows:
- ```
  GET /global_rankings

  Parameters

  number_of_teams integer (query) - number of teams to return a ranking for, the default is 20
  ```
- ```
  GET /team_rankings/

  Parameters

  team_ids array[string] (query) *required IDs of tournaments to return ranking for
  ```
- ```
  GET /tournament_rankings/{tournament_id}

  Parameters

  tournament_id string (path) *required ID of tournament to return rankings for
  ```
# Project Set-Up (Ubuntu based machines)
First you need to install mongodb-org(version 7.0) and nodejs(v16.20.0) on your ubuntu machine.
- In order to install mongodb on ubuntu jammy you can follow [this](https://www.cherryservers.com/blog/install-mongodb-ubuntu-22-04) guide.
- In order to install nodejs on ubuntu using nvm you can follow [this](https://heynode.com/tutorial/install-nodejs-locally-nvm/) guide.
- Also, if you don't have git install it using
```console
sudo apt install git
```

Now start mongod server locally on your linux machine 
```console
sudo systemctl start mongod
```
You can verify that mongod is running by typing
```console
sudo systemctl status mongod
```

After starting mongodb you need to clone the repo and import the exported mongodb databases. Clone the repo first:
```console
git clone https://github.com/Harshroxnox/backend.git
```
then move to the directory where you are going to find the dumped database files
```console
cd backend/data/ratings/
```
then import the databases. You will be importing two databases one is backend_db(for first two routes) and the other tournament_ratings(for third route)
```console
mongorestore --db backend_db dump/backend_db/
mongorestore --db tournament_ratings dump/tournament_ratings/
```
After this all you have to do is install the npm dependencies. You can do this by running `npm install` in the main project directory. So, go to the backend folder and run:
```console
npm install
```
You can start the server on localhost:3000 by running the command:
```console
npm run dev
```
