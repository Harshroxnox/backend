const express = require("express");
const app = express();

//load config fron env file
require("dotenv").config({path:__dirname+'/routes/.env'});
const PORT = process.env.PORT||9000;

//middleware to parse json request body
app.use(express.json());

//import routes for rankings api
const ranking_routes = require("./routes/ranking_routes");

//server start
app.listen(PORT,()=>{
    console.log(`server started sucessfully at ${PORT}`);
})

//connect to database
//const dbConnect = require("./config/database");

//connecting to backend_db which is used for first two routes
//dbConnect(process.env.DATABASE_URL_1);
//console.log('connecting to backend_db')

//connecting to tournament_ratings which is used for the third route
//dbConnect(process.env.DATABASE_URL_2);
//console.log('connecting to tournament_ratings')

//default route
app.get("/",(req,res)=>{
    res.send('<h1> this is homepage</h1>'); 
})

//configure the app to use the app
app.use("/", ranking_routes);

