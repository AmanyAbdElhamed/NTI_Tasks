const userModel=require("../../models/user.model")
const appointmentModel=require("../../models/appointment.model")

class Appointment{
    static addApoint =async(req,res)=>{
        try {
            const doctor=await userModel.findOne({_id:req.body.doctor})
            const patient=await userModel.findOne({_id:req.body.user})
             
            const apoint= new appointmentModel({
                appointDate:req.body.appointDate,
                patient:patient,
                doctor:doctor
          })
         
          await apoint.save()
          res.status(200).send({
            apiStatus:true,
            data:apoint,
            message:"Appointment inserted successfuly"
        })
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message: "error adding appointment"
            })
        }
    }
    static AddMedical=async(req,res)=>{
        try {
            const IdPatient=req.params.id
            const medicals=req.body.medical
            const dataOfPatient=await userModel.findOne({_id:IdPatient})
            dataOfPatient.prescriptions.Medicines.push({medical:medicals})
            await dataOfPatient.save()
           res.status(200).send({
               apiStatus:true,
               data:dataOfPatient,
               message:"data inserted successfuly"
        
           })
        } catch (e) {
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"Error in inserted datay"
         
            })
        }
       
    
    }
    static myVAppoint =async(req,res)=>{
        try {
            const IDS=[]
            const patientdate=[]
            const allDoctors=[]
            const pat=[]
            await req.user.populate("myAppointment")
           
            for(var i=0; i<req.user.myAppointment.length; i++) {
              
              IDS.push(req.user.myAppointment[i].patient)
              patientdate.push(req.user.myAppointment[i].appointDate)
              
            }
            for(var i=0; i<IDS.length; i++) {
               
                 pat.push(await userModel.findOne({_id: IDS[i]}))
              
                allDoctors.push({patientName:pat[i].name,_id:pat[i]._id,
                    PatientEmail:pat.email,appointDate:patientdate[i]})
                
              }
           
            res.status(200).send({
                apiStatus:true,
                data:allDoctors,
                message:" show data  successfuly"
         
            })
         } catch (e) {
             res.status(500).send({
                 apiStatus:false,
                 data:e.message,
                 message:"Error in show list"
          
             })
         }
        
    } 
    static myVdoctors =async(req,res)=>{
        try {
            const IDS=[]
            const patientdate=[]
            const allDoctors=[]
            const pat=[]
           const rel= await req.user.populate("myAppointmentofdoctors")
          
            for(let i=0; i<req.user.myAppointmentofdoctors.length; i++) {
              IDS.push(req.user.myAppointmentofdoctors[i].doctor)
              patientdate.push(req.user.myAppointmentofdoctors[i].appointDate)
              
            }
            for(var i=0; i<IDS.length; i++) {
               
                 pat.push(await userModel.findOne({_id: IDS[i]}))
              
                allDoctors.push({DoctorName:pat[i].name,
                    specialty:pat[i].specialty,
                    _id:pat[i]._id,
                    PatientEmail:pat.email,
                    appointDate:patientdate[i]
                })
                
              }
           
            res.status(200).send({
                apiStatus:true,
                data:allDoctors,
                message:" show data  successfuly"
         
            })
         } catch (e) {
             res.status(500).send({
                 apiStatus:false,
                 data:e.message,
                 message:"Error in show list"
          
             })
         }
        
    }  


}
module.exports=Appointment