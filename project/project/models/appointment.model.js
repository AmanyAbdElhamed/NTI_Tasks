const mongoose=require("mongoose")
const userModel=require("../models/user.model")
const appointmentSchema= new mongoose.Schema({
    appointDate:{
        type:String,
        trim:true,
       // required:true,
        default:new Date()
    },
    doctor:{
       // type:mongoose.Schema.Types.ObjectId,
       type:Object,
        required:true,
        ref:'User'
    },
    patient:{
        //type:mongoose.Schema.Types.ObjectId,
        type:Object,
        required:true,
        ref:'User'
    }
},
{timestamps:true}
)


const Appointment = mongoose.model("Appointment",appointmentSchema)
module.exports=Appointment
