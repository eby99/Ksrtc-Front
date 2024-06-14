const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "name": String,
        "email": String,
        "phno": String,
        "gender": String,
        "passwd": String,
        "bname": String



    }
)

let busmodel=mongoose.model("buses",schema)
module.exports={busmodel}