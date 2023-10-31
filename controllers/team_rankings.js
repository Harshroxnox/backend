const mongoose = require("mongoose");
const dbConnect = require("../config/database");
require("dotenv").config({path:__dirname+'/routes/.env'});


exports.team_rankings = async (req, res) => {

    dbConnect(process.env.DATABASE_URL_1);
    const Team = require("../models/Team");

    const teamName = req.query.name||[];
    
    try {
      const teamRankings = await Team.find({ name: { $in: teamName }  }); 
      mongoose.connection.close();
      res.json(teamRankings);
  
    } catch (error) {
      mongoose.connection.close();
      res.send(error)
    }
  }

  
  