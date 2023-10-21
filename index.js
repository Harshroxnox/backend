const express = require("express");
const app = express();

//load config fron env file
require("dotenv").config({path:__dirname+'/routes/.env'});
const PORT = process.env.PORT||9000;

//middleware to parse json request body
app.use(express.json());

//import routes for todo api
const ranking_routes = require("./routes/ranking_routes");

//mount the todo apis
//app.use("/api/v1",todoroutes);

//server start
app.listen(PORT,()=>{
    console.log(`server started sucessfully at ${PORT}`);
})

//connect to database
const dbConnect = require("./config/database");
dbConnect();

//default route
app.get("/",(req,res)=>{
    res.send('<h1> this is homepage baby</h1>'); 
})

app.use("/", ranking_routes);
