const fs=require('./files.controllers')
const ValiadtorController=require('./validator.controller')
class Customer{
    static showAll=(req,res)=>{
        const data=fs.readFromJSON()
        const isEmpty=data.length==0
        res.render('all',{PageTitle:'All Customers',data,isEmpty})
    }
    static AddCustomer=(req,res)=>{
        const customer=['name','email','adress','phone','intialBalance','transactions']
        res.render('addPost',{PageTitle:'Add New Customer',customer,errors:{}})
    }
    static  addCustomerLogic = (req,res)=>{
        let customer=req.body
        let errors={}
        const transactions=[]
        
        if(!ValiadtorController.isEmptyString(customer.name))
            errors.name="name is required"
           
        if(!ValiadtorController.isValidEmail(customer.email))
            errors.email="enter a valid mail"
         
        if(!ValiadtorController.isValidPhone(customer.phone))
            errors.phone="enter a valid phone"    
        if(ValiadtorController.isValidNumber(customer.intialBalance)) 
            errors.intialBalance="enter a valid Balance"
        
        if(Object.keys(errors).length>0){
        
          return  res.render('addPost',{
                pageTitle:"add new Customer",
                errors,
                customer
            })
        }     
        const data =fs.readFromJSON()
        
        if(data.length == 0) customer.accNum=5000
        else customer.accNum = data[data.length-1].accNum +1
        customer.transactions=[]
        data.push(customer)
        fs.writeDataToJSON(data)
        res.redirect("/")
    }
    static searchCustomerByID = (accNum, data)=>{
        let customerIndex = data.findIndex(el=> el.accNum == accNum)
        return customerIndex
    }
    static searchTransactionByID = (id, data)=>{
        let tranIndex = data.findIndex(el=> el.tranNum == id)
        return tranIndex 
    }
    static singleCustomer=(req,res)=>{
        let isNotFound=false
        const accNum=req.params.id
        const data=fs.readFromJSON()
        const customerIndex=this.searchCustomerByID(accNum,data)
        if(customerIndex==-1)isNotFound=true
        res.render('single',{
            
            PageTitle:'Single Customer',
            customer:data[customerIndex],
            isNotFound
        })
    }
    static editCustomer=(req,res)=>{
        let isNotFound=false
        const accNum=req.params.id
        const data=fs.readFromJSON()
        const customerIndex=this.searchCustomerByID(accNum,data)
        if(customerIndex==-1)isNotFound=true
        res.render('edit',{
            
            PageTitle:'Edit Customer',
            customer:data[customerIndex],
            isNotFound
        })

    }
    static editLogic=(req,res)=>{
        const accNum=req.params.id
        const data=fs.readFromJSON()
        const customerIndex=this.searchCustomerByID(accNum,data)
        const customer=req.body
        const errors={}
        if(!ValiadtorController.isEmptyString(customer.name))
            errors.name="name is required"
           
        if(!ValiadtorController.isValidEmail(customer.email))
            errors.email="enter a valid mail"
         
        if(!ValiadtorController.isValidPhone(customer.phone))
            errors.phone="enter a valid phone"    
        if(ValiadtorController.isValidNumber(customer.intialBalance)) 
            errors.intialBalance="enter a valid Balance"
        
        if(Object.keys(errors).length>0){
            return  res.render('edit',{
                pageTitle:"Edit Customer",
                errors,
                customer
            })
        }

        data[customerIndex]={accNum,...customer}
        fs.writeDataToJSON(data)
        res.redirect('/')
        
    }
    static deletCustomer=(req,res)=>{
        
        const accNum=req.params.id
        const data=fs.readFromJSON()
        const customerIndex=this.searchCustomerByID(accNum,data)
        if(customerIndex!=-1){
            data.splice(customerIndex, 1 )
            fs.writeDataToJSON(data)
            res.redirect("/")    
        }
        else res.redirect('/err')
        

    }
    static addTransaction=(req,res)=>{
        let isNotFound=false
        const accNum=req.params.id
        const data=fs.readFromJSON()
        const customerIndex=this.searchCustomerByID(accNum,data)
        if(customerIndex==-1)isNotFound=true
        return res.render('transaction',{
            PageTitle:'Transaction of Customer',
            customer:data[customerIndex],
            isNotFound
        })
    }
    static addTransactionLogic=(req,res)=>{
        const tran=req.body
        const accNum=req.params.id
        const data=fs.readFromJSON()
        const customerIndex=this.searchCustomerByID(accNum,data)
        
        const errors={}
        let tranNum
        
        if(ValiadtorController.isValidNumber(tran.value)) 
            errors.value="enter a valid Balance"
        
        if(Object.keys(errors).length>0){
            return  res.render('transaction',{
                pageTitle:"Customer Transaction",
                errors,
                tran
            })
        }
        const tranData=data[customerIndex]['transactions']
        if(tranData.length == 0) tranNum=1
        
        else tranNum = (tranData.length) +1
        
        tranData.push({tranNum,...tran})
        fs.writeDataToJSON(data)
        res.redirect('/')
        

    }
    static showTransaction=(req,res)=>{
        const id=req.params.id
        const data=fs.readFromJSON()
        const customerIndex=this.searchCustomerByID(id,data)
        const tranData=data[customerIndex]['transactions']
        const isEmpty=tranData.length==0
        
        res.render('showTransaction',{PageTitle:'All Transactions',tranData,isEmpty,id}) 
    }
    static deletTransaction=(req,res)=>{
        const id=req.params.id
        const idTran=req.params.idTran
        const data=fs.readFromJSON()
        const customerIndex=this.searchCustomerByID(id,data)
        const tranData=data[customerIndex]['transactions']
        const transactionIndex=this.searchTransactionByID(idTran,tranData)
        
        if(customerIndex!=-1&&transactionIndex!=-1){
            tranData.splice(transactionIndex, 1 )
            data[customerIndex]['transactions']=tranData
            fs.writeDataToJSON(data)
            res.redirect("/")    
        }
        else res.redirect('/err')

    }
}
module.exports=Customer