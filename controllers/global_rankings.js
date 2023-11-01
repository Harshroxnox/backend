const { MongoClient } = require('mongodb');

const client1 = new MongoClient('mongodb://localhost:27017/backend_db');

exports.global_rankings = async (req, res) => {
  // Get the number of teams to display
  const numberOfTeams = req.query.number_of_teams || 20;

  try {

    // Connect to mongodb database
    await client1.connect();

    // Connect to the database and the collection
    const backend_db = client1.db();
    const collection_backend = backend_db.collection("team_ratings");
  
    // Running the query to get top numberOfTeams teams sorted by rating
    const globalRankings = await collection_backend.find({}).sort({ rating: -1 }).limit(numberOfTeams).toArray();
    client1.close();

    // Sending that as a response
    res.json(globalRankings);

  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
}