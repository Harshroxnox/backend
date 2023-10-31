const mongoose = require("mongoose");

const dbConnect = (url) => {
    mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    })
}
module.exports = dbConnect;