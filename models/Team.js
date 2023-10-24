const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

    team_id:{
        type:Number,
        required:true,
    },

    rating:{
        type:Number,
        required:true,
    },

    name:{
        type:String,
        required:true,
    },

    acronym:{
        type:String,
        required:true,
    },

});

module.exports = mongoose.model('Team', teamSchema, 'team_ratings');
