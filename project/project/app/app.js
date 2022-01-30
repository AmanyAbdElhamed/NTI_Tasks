const express=require("express")
const app= express()
const cors = require('cors')

require("dotenv").config()
require("../models/dbConnection/dbConnection")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
const userRoutes=require("../routes/user.routes")
app.use("/doc",userRoutes)

const appointRouter=require("../routes/appointment.routes")
app.use("/appoint",appointRouter)
const path=require('path')
app.get('/files/:ext/:imPath',async(req,res)=>{
    let filePath=`../${req.params.ext}/${req.params.imPath}`
    res.sendFile(path.join(__dirname,filePath))
})

module.exports=app