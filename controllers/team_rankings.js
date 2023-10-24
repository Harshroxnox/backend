
const Team = require("../models/Team");

exports.team_rankings = async (req, res) => {

    const teamName = req.query.name||[];
    
    try {
      const teamRankings = await Team.find({ name: { $in: teamName }  }); // Example query
      res.json(teamRankings);
    } catch (error) {
      res.send(error)
    }
  }

  
  