const mongoose=require("mongoose")
const validator=require("validator")
const bcryptjs = require("bcryptjs")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)) throw Error("invalid email ")
        }
    },
    password:{
        type:String,
        trim:true,
        require:true,
        minlength:6
    },
    status:{
        type:Boolean,
        default:false
    },
    userType:{
     type:String,
     trim:true,
     enum:["Admin","Patient","Doctor"]
    },
    specialty:{
      type:String,
      required:function(){return this.userType=="Doctor"}
    },
    analysis:{
     type:String
    },
    prescriptions:{
     Medicines:[{
        prescriDate:{type:String ,default:new Date()},
        medical:{ type:String }
    }]
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    img:{
      type:String
    },
    otp:{
        type:String,
        default:Date.now()
    }

},
{timestamps:true}
)

//handle response
userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.__v
    delete user.password
    delete user.tokens
    return user
}
//update save
userSchema.pre("save",async function(){
    const user=this
    if(user.isModified("password"))
       user.password=await bcryptjs.hash(user.password,12)
})

//login Admin
userSchema.statics.loginAdmin=async(email,password)=>{
    const admin=await User.findOne({email})
    if(!admin)throw new Error("Invalid admin email")
    const isValid=await bcryptjs.compare(password,admin.password)
    if(!isValid)throw new Error("Invalid password")
    return admin
}
//login user
userSchema.statics.loginUser = async(email,password)=>{
    const user = await User.findOne({email})
    if(!user) throw new Error("invalid user email")
    const isValid = await bcryptjs.compare(password, user.password)
    if(!isValid) throw new Error("invalid password")
    return user
}
//generate token
const jwt = require("jsonwebtoken")
const { type } = require("express/lib/response")
userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id}, "123") //user{_id:1}
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.virtual("myAppointment",{
    ref:"Appointment",
    localField:"_id",
    foreignField:"doctor"
})
userSchema.virtual("myAppointmentofdoctors",{
    ref:"Appointment",
    localField:"_id",
    foreignField:"patient"
})


const User=mongoose.model("User",userSchema)
module.exports=User