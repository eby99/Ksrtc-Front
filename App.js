const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcryptjs = require("bcryptjs")
const { ksrtcmodel } = require("./Models/Ksrtc.js")
const jsonwebtoken = require("jsonwebtoken")


const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://eby99:qwerty123@cluster0.snm8zbn.mongodb.net/ksrtcDB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashPasswd = async (passwd) => {
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(passwd, salt)
}

app.post("/signup", async (req, res) => {
    let input = req.body
    let hashPasswd = await generateHashPasswd(input.passwd)
    console.log(hashPasswd)
    input.passwd=hashPasswd
    let ksrtc = new ksrtcmodel(input)
    ksrtc.save()
    res.json({ "status": "success" })

})

app.post("/login",(req,res)=>{
    //res.json("status":"success")
    let input = req.body
    ksrtcmodel.find({"email":req.body.email}).then(
        (response)=>{
            //console.log(response)
            if (response.length>0) {
                let dbPassword = response[0].passwd
                console.log(dbPassword)
                bcryptjs.compare(input.passwd,dbPassword,(error,isMatch)=>{
                    if (isMatch) {
                      jsonwebtoken.sign({email:input.email},"ksrtcapp",{expiresIn:"1d"},(error,token)=>{
                        if (error) {
                            res.json({"status":"unable to create token"})
                            
                        } else {
                            res.json({"status":"success","userId":response[0]._id,"token":token})
                            
                        }
                      })  
                    } else {
                        res.json({"status":"incorrect Password"})
                    }
                })
                
            } else {
                res.json({"status":"user not found"})
                
            }
        }
    ).catch()

})


app.post("/viewers",(req,res)=>{
    let token = req.headers["token"]
    jsonwebtoken.verify(token,"ksrtc-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"Unauthorized access"})
            
        } else {
            if (decoded) {
                ksrtcModel.find().then(
                    (response)=>{
                        res.json(response)
                    }
                ).catch()
            }
            
        }
    })
})



app.listen(8080, () => {
    console.log("Server ON !")
})