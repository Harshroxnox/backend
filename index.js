const express = require("express");
const app = express();

//load config fron env file
require("dotenv").config({path:__dirname+'/.env'});
const PORT = process.env.PORT||9000;

//middleware to parse json request body
app.use(express.json());

//import routes for rankings api
const ranking_routes = require("./routes/ranking_routes");

//server start
app.listen(PORT,()=>{
    console.log(`server started sucessfully at ${PORT}`);
})

//default route
app.get("/",(req,res)=>{
    res.send('<h1> this is homepage</h1>'); 
})

//configure the app to use the app
app.use("/", ranking_routes);

