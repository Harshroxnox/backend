

// We are currently developing this route and this is under developement so kindly do not use this


//define route handler
exports.tournament_rankings = async(req,res)=>{

    const teamIdString = req.query.team_ids||[];
    const team_ids = teamIdString.split(',');
    

    res.json({ result: team_ids });
}