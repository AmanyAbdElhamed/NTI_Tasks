const multer=require("multer")
const path=require("path")

const storage=multer.diskStorage({
    destination:function(req,file,cb){
         cb(null,"images")
    },
    filename:function(req,file,cb){
        const myFileName=Date.now()+path.extname(file.originalname)
        
            cb(null,myFileName)
    },
})
const upload=multer({
    storage,
    limits:{fieldSize:200000000},
    fileFilter:function(req,file,cb){
       if(path.extname(file.originalname)==".pdf")cb(null,true)
       else if(path.extname(file.originalname)==".png")cb(null,true)
       else return cb("invalid", null)
    }

})
module.exports=upload