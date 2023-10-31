const mongoose = require("mongoose");
const dbConnect = require("../config/database");
require("dotenv").config({path:__dirname+'/routes/.env'});

exports.global_rankings = async (req, res) => {

  // Connect to mongodb database
  dbConnect(process.env.DATABASE_URL_1);
  const Team = require("../models/Team");
  
  const numberOfTeams = req.query.number_of_teams || 20;
  try {
    const globalRankings = await Team.find({}).sort({ rating: -1 }).limit(numberOfTeams);
      
    const formattedRankings = globalRankings.map(team => {
      return {
          ...team._doc,
          name: team.name + ' ' // Add a space after the team name
      };
    });
    mongoose.connection.close();
    res.json(formattedRankings);


  } catch (error) {
      await mongoose.connection.close();
      res.status(500).json({ error: 'Internal Server Error' });
  }
}