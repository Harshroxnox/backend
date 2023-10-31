const mongoose = require("mongoose");
const dbConnect = require("../config/database");
require("dotenv").config({path:__dirname+'/routes/.env'});
const tournamentSchema = require("../models/tournamentSchema");

//define route handler
exports.tournament_rankings = async(req,res)=>{

    dbConnect(process.env.DATABASE_URL_2);

    // tournament_id is going to be the name of the collection inside the database
    const tournament_id = req.params.tournament_id;
    Tournament = mongoose.model('Tournament', tournamentSchema, tournament_id);
    teamRankings = await Tournament.find({}).limit(20);

    // Close the mongodb connection
    mongoose.connection.close();

    dbConnect(process.env.DATABASE_URL_1);
    const Team = require("../models/Team");
    response_arr = []

    for (let i = 0; i < teamRankings.length; i++) {
        teamId = teamRankings[i].team_id;
        const team = await Team.findOne({team_id: teamId});
        updated_team = {
            team_id: teamId,
            rating: teamRankings[i].rating,
            name: team.name,
            acronym: team.acronym
        }
        response_arr.push(updated_team)
    }

    try {
        // Close the mongodb connection
        mongoose.connection.close();
        res.json(response_arr);
    } catch (error) {
        // Close the mongodb connection
        mongoose.connection.close();
        res.send(error)
    }

}