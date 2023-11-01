const { MongoClient } = require('mongodb');

const client1 = new MongoClient('mongodb://localhost:27017/backend_db');

exports.team_rankings = async (req, res) => {
    
    const teamIds = req.query.team_ids||[];
    
    try {

      // Connect to mongodb database
      await client1.connect();
    
      // Connect to the database and the collection
      const backend_db = client1.db();
      const collection_backend = backend_db.collection("team_ratings");

      // Run the query to find the teams by their ids
      const teamRankings = await collection_backend.find({ team_id: { $in: teamIds }  }).sort({ rating: -1 }).toArray(); 
      client1.close();
      
      res.json(teamRankings);
  
    } catch (error) {

      res.send(error)
    }
  }

  
  