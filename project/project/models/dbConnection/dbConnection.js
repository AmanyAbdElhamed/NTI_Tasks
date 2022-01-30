const mongosse=require("mongoose")
try {
    mongosse.connect(process.env.DBURL)
} catch (error) {
    console.log(error)
}