const express = require("express");
const router  = express.Router();

//import controller
const{global_rankings} = require("../controllers/global_rankings");
const{team_rankings} = require("../controllers/team_rankings");
const{tournament_rankings} = require("../controllers/tournament_rankings");

//define api routes
router.get("/global_rankings",global_rankings);
router.get("/team_rankings",team_rankings);
router.get("/tournament_rankings",tournament_rankings);

module.exports = router;