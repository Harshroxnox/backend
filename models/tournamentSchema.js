const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({

    team_id:{
        type:String,
        required:true,
    },

    rating:{
        type:Number,
        required:true,
    },

});

module.exports = tournamentSchema;
