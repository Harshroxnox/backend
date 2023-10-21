const mongoose = require("mongoose");

require("dotenv").config({path:__dirname+'/routes/.env'});

    const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=> console.log("db connection is sucessfull"))
.catch((error)=>{
    console.log("Error connecting to database");
    console.error(error.message);
    process.exit(1);
});
}
module.exports = dbConnect;