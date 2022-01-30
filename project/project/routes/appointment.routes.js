const router=require("express").Router()
const authpatient=require("../middleware/authpatient")
const authdoctor=require("../middleware/authdoctor")
const userController=require("../app/controller/appointment.controller")

router.post("/addApoint",authpatient,userController.addApoint)
router.get("/myVdoctors",authpatient,userController.myVdoctors)

router.get("/myVAppoint",authdoctor,userController.myVAppoint)
router.post("/AddMedical/:id",authdoctor,userController.AddMedical)


module.exports=router