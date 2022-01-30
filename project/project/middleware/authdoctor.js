
const jwt=require('jsonwebtoken')
const userModel=require('../models/user.model')
const doctorAuth = async(req,res,next)=>{
    
    
    try {
        //get authorization from header
        const token =req.header("Authorization").replace("bearer","")
        const myVerfiyToken=jwt.verify(token,"123")
        const user=await userModel.findOne({
            _id:myVerfiyToken._id,
            "tokens.token":token
        })
       
        
        if(!user)throw new Error("unauthorized ")
        else if(user.userType!='Doctor')throw new Error("unauthorized As Doctor")
        req.user=user
        req.token=token
        next()
        
    } catch (e) {
        res.status(500).send({
            apiStatus:false,
            data:e.message, 
            message:"unauthorized"
        })
    }
        

}

module.exports =  doctorAuth