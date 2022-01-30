const router = require('express').Router()
const userController = require("../app/controller/user.controller")
const authpatient = require("../middleware/authpatient")
const authAdmin=require("../middleware/adminAuth")
const auth=require("../middleware/auth")
const uploadFile=require("../middleware/uploadFile")

router.post("/AdminLogin",userController.adminLogin)
router.post('/add',userController.add)
router.post("/register", userController.addUser)
router.post("/login", userController.login)

router.get("/all",authAdmin,userController.showAll)
router.get("/all/:id",auth, userController.showSingle)

router.delete("/all",authAdmin, userController.deleteAll)
router.delete("/all/:id",authAdmin, userController.deleteSingle)


router.post("/editProfile/:id",auth,userController.editProfile)
router.post("/editMyProfile",auth,userController.editMyProfile)
router.get("/logout",auth ,userController.logOut)
router.get("/logoutAll", authAdmin, userController.logOutAll)

router.get("/activate/:otp/:id",auth ,userController.activateUser)
router.post("/activateWithLogin",auth, userController.activateUserLoggedIN)
router.get("/sendOTP",auth, userController.sendOtp)

router.post("/changePass",auth,userController.changePassword)


router.post("/UploadImage",auth,uploadFile.single("image"),userController.uploadProfilePicture)
router.post("/uploadAnalysis",authpatient,uploadFile.single("file"),userController.uploadFile)

router.get("/myProfile",auth,userController.showMyProfile)
router.get("/myMedicals/:id",authpatient,userController.showMyMedicals)

router.get('/allDoctor',authpatient,userController.showAllDoctor)

module.exports=router