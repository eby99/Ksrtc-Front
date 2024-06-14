const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "name": String,
        "email": String,
        "passwd": String


    }
)

let blogmodel=mongoose.model("users",schema)
module.exports={blogmodel}