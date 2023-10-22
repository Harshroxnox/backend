//import th model
const Team = require("../models/Team");

exports.team_rankings = async (req, res) => {
  //res.send('<h1> this is team rankings route</h1>'); { $in: teamIds }
  // http://localhost:3000/team_rankings?team_ids[]=99566405130451785&team_ids[]=98926509883054987&team_ids[]=100205576307813373
    const teamName = req.query.name||[];
    
    
    try {
      const teamRankings = await Team.find({ name: { $in: teamName }  }); // Example query
      res.json(teamRankings);
    } catch (error) {
      res.send(error)
    }
  }

  
  