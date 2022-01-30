const userModel=require("../../models/user.model")
const otpGenerator = require('otp-generator')
const bcryptjs = require("bcryptjs")
const emailHelper = require("../helper/sendMail.helper")
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
class User{
static addUser=async(req,res)=>{
       try {
        let user =new userModel(req.body)
        user.otp=otpGenerator.generate(12)
        user.userType='Patient'
        await  user.save()
        emailHelper(user.email,`http://localhost:3000/user/activate/${user.otp}/${user._id}`)
        res.status(200).send({
            apiStatus:true,
            data:user,
            message:"data inserted successfuly"
        })
       } catch (e) {
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message: "error adding user data"
        })
       }
}
static add=async(req,res)=>{
        try {
         let user =new userModel(req.body)
         user.otp=otpGenerator.generate(12)
         await  user.save()
         emailHelper(user.email,`http://localhost:3000/user/activate/${user.otp}/${user._id}`)
         res.status(200).send({
             apiStatus:true,
             data:user,
             message:"data inserted successfuly"
         })
        } catch (e) {
         res.status(500).send({
             apiStatus: false,
             data: e.message,
             message: "error adding user data"
         })
        }
        

} 
static sendOtp=async(req,res)=>{
    try{
        if(status) throw new Error("User already active")
        req.user.otp = otpGenerator.generate(12);
        await req.user.save()
        emailHelper(req.user.email, `${req.user.otp}`)
        res.status(200).send({
            apiStatus: true,
            data: req.user.otp,
            message: "User Activated"
        })
    }
    catch (e) {
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message: "error in active"
        })
}
}
static activateUser = async(req,res)=>{
    try{
        let user = await userModel.findOne({otp:req.params.otp,_id:req.params.id})
        if(!user) throw new Error("not a user")
        user.status=true
        user.otp=""
        await user.save()
        res.status(200).send({
            apiStatus: true,
            data: req.user.otp,
            message: "User Activated"
        })
    }
    catch (e) {
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message: "error in active"
        })
        }
}
static activateUserLoggedIN = async(req,res)=>{
    try{
        if(req.user.otp != req.body.otp) throw new Error("invalid code")
        req.user.status=true
        req.user.otp=""
        await req.user.save()
        res.status(200).send({
            apiStatus: true,
            data: req.user.otp,
            message: "User Activated"
        })
    }
    catch (e) {
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message: "error in active"
        })
    }
}
static adminLogin=async(req,res)=>{
    try {
        const admin=await userModel.loginAdmin(req.body.email, req.body.password)
        let token = await admin.generateToken()
        res.status(200).send({
            apiStatus:true,
            data:{admin, token},
            message:"Admin logged in"
        })
    }
    catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message, 
            message:"invalid data"
        })
    }
}
static showAll=async(req,res)=>{
    try {
     const allData =await userModel.find()
     res.status(200).send({
         data:allData,
         message:" data viewed successfuly "
     })
    } catch (e) {
        res.status(500).send({
            data:e.message,
            message:"error view user data"
        })
    }
   
}
static showSingle = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        let message= "view single User data successfuly"
        let mStatus = 200
        if(!user){ message="user not found"; mStatus=404 } 
        res.status(mStatus).send({
            apiStatus: true,
            data: user,
            message
        })
    }
    catch (e) {
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message: "error view single user data"
        })
    }

}
static deleteAll = async (req, res) => {
    try{
        const data = await userModel.deleteMany()
        res.status(200).send({apiStatus:true,data,message:"deleted"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"delete error"})
    }
}
static deleteSingle = async (req, res) => {
    try{
        const data = await userModel.findByIdAndDelete(req.params.id)
        let message="deleted"
        let mStatus=200
        if(!data){message="user Not Found"; mStatus=404}
        res.status(mStatus).send({apiStatus:true,data,message:message})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"delete error"})
    }

}
static login = async(req, res)=>{
    try{
        let user = await userModel.loginUser(req.body.email, req.body.password)
        let token = await user.generateToken()
        res.status(200).send({apiStatus:true, data:{user, token}, message:"logged in"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"invalid data"})
    }
}
static logOut = async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(t=>{
            return t.token != req.token
        })
        await req.user.save()
        res.status(200).send({
            apiStatus:true,
            data:req.user,
            message:"logged out"
        })
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message})
    }

}
static logOutAll = async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({
            apiStatus:true,
            data:req.user,
            message:"logged out from all"
        })
        
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message})
    }
}
static changePassword=async(req,res)=>{
    try {
         const isValid = await bcryptjs.compare(req.body.oldPassword,req.user.password)
         if(!isValid) throw new Error("invalid password")
        req.user.password = req.body.newPassword
         await req.user.save()
        res.status(200).send({
            apiStatus:true,
            data:req.user,
            message:"change password successfly"
        })
    } catch (e) {
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"Error in change"
        })
    }
    

}
static uploadProfilePicture=async(req,res)=>{
   
    try {
        req.user.img=req.file.path
        await req.user.save()
        res.status(200).send({
            apiStatus:true,
            data:req.user,
            message:"Upload image successfly"
        })
    } catch (e) {
        res.status(500).send({
            
            apiStatus:false,
            data:e.message,
            message:"Error in Upload image "
        })
    }
}
static showMyProfile=async(req,res)=>{
    res.status(200).send({
        apiStatus:true,
        data:req.user,
        message:"done "

    })
}
static uploadFile=async(req,res)=>{
    try {
        req.user.analysis=req.file.path
        await req.user.save()
        res.status(200).send({
            apiStatus:true,
            data:req.user,
            message:"Upload File successfly"
        })
    } catch (e) {
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"Error in Upload File "
        })
    }
}
static showMyMedicals=async(req,res)=>{
    try {
        const medicals=await userModel.findOne({_id:req.params.id})
        res.status(200).send({
            apiStatus:true,
            data:medicals.Medicines,
            message:"show data successfly"
        })
    } catch (e) {
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"Error in show data "
        })
    }
}
static editMyProfile=async(req,res)=>{
    try {
         const update=await userModel.findOneAndUpdate({_id:req.user._id},{$set:{...req.body}})
         await update.save()
        res.status(200).send({
            apiStatus:true,
            data:update,
            message:"Edit data successfly"
        })
    } catch (e) {
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"Error in edit data "
        })
    }
}
static editProfile=async(req,res)=>{
    try {
         const update=await userModel.findOneAndUpdate({_id:req.params.id},{$set:{...req.body}})
         await update.save()
        res.status(200).send({
            apiStatus:true,
            data:update,
            message:"Edit data successfly"
        })
    } catch (e) {
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"Error in edit data "
        })
    }
}
static showAllDoctor=async(req,res)=>{
   
    try {
        const allDoctors= await userModel.find({userType:'Doctor'})
        res.status(200).send({
            data:allDoctors,
            message:" data viewed successfuly "
        })
       } catch (e) {
           res.status(500).send({
               data:e.message,
               message:"error view doctors data"
           })
       }
}
}

module.exports=User