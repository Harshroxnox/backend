const { MongoClient } = require('mongodb');

const client1 = new MongoClient('mongodb://localhost:27017/backend_db');
const client2 = new MongoClient('mongodb://localhost:27017/tournament_ratings');

// define route handler
exports.tournament_rankings = async(req,res)=>{

    // tournament_id is going to be the name of the collection inside the database(tournament_ratings)
    const tournament_id = req.params.tournament_id;

    try {

        // Connect to the second MongoDB instance
        await client2.connect();
  
        const tournament_rankings_db = client2.db();
  
        const collection_tournament = tournament_rankings_db.collection(tournament_id);
        const teamRankings = await collection_tournament.find({}).sort({ rating: -1 }).limit(25).toArray();
        client2.close();
      
        // Now we have the teams sorted in descending order according to the ratings in the teamRankings
        // variable. Now we will connect to the first database to get the team name and team code of the 
        // teams in the teamRankings and store it in a new variable called response_arr which we are 
        // going to return as json.

        // Connecting to the first database(backend_db)
        await client1.connect();
        const backend_db = client1.db();
        const collection_backend = backend_db.collection("team_ratings");

        response_arr = [];

        for (let i = 0; i < teamRankings.length; i++) {
            teamId = teamRankings[i].team_id;
            const team = await collection_backend.findOne({team_id: teamId});
            updated_team = {
                team_id: teamId,
                rating: teamRankings[i].rating,
                name: team.name,
                acronym: team.acronym
            }
            response_arr.push(updated_team)
        }
        client1.close();

        // Sending the response as json
        res.json(response_arr);

    } catch (error) {
        res.send(error)
    }

}