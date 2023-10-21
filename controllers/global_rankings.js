const Team = require("../models/Team");


exports.global_rankings = async (req, res) => {
 /* res.send('<h1> this is global rankings route</h1>'); 
  async function getAllTeams() {
    try {
      const teams = await Team.find({});
      console.log(teams);
    } catch (error) {
      console.error(error);
    }
  }
  getAllTeams();*/
  
    const numberOfTeams = req.query.number_of_teams || 20;
    try {
      const globalRankings = await Team.find({}).sort({ rating: -1 }).limit(numberOfTeams);
      
      const formattedRankings = globalRankings.map(team => {
        return {
            ...team._doc,
            name: team.name + ' ' // Add a space after the team name
        };
    });

    res.json(formattedRankings);



   //res.json(globalRankings);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}