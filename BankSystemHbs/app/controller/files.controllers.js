const fs=require('fs')

class FilesControler{
    static readFromJSON = () =>{
        let data
        try{
            data = JSON.parse(fs.readFileSync("./models/data.json"))
            if(!Array.isArray(data)) throw new Error()
        }
        catch(e){
            data = []
        }
        return data
    }
    static writeDataToJSON = (data) =>{
        try{
            fs.writeFileSync("./models/data.json", JSON.stringify(data))
        }
        catch(e){
            console.log(chalk.red(e.message))
        }
    }

}

module.exports=FilesControler