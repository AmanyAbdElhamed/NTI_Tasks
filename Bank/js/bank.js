
readDataFromStorge=()=>{
    let data
    try {
        data=JSON.parse(localStorage.getItem("customers"))
        if(!Array.isArray(data))throw new Error('data isn\'t array')
        
    } catch (exp) {
        data=[]
    }

return data
}

setDataOfCustomerToStorage=(myData)=>{
   
    if(!Array.isArray(myData))myData=[]
    myData=JSON.stringify(myData)
    
    localStorage.setItem("customers",myData)

}

cusomerMain=[
   {name:'accNum' , dataStore:"value" ,default:5000, isDefault:true},
    {name:'customerName' , dataStore:"value",default:null, isDefault:false},
    {name:'address' , dataStore:"value",default:null, isDefault:false},
    {name:'phone' , dataStore:"value",default:null, isDefault:false},
    {name:'intialBalance' , dataStore:"value",default:null, isDefault:false},
   {name:'transaction',dataStore:null,default:_=>[]}
]

custTransctions=[
    {transactionType:'transactionType', value:'value'}     
]

const customerData=document.querySelector("#AddCustomer")
const content=document.querySelector("#content")
const single=document.querySelector("#single")
const addtran=document.querySelector("#Addtransaction")
const editForm= document.querySelector("#editForm")
const withdraw=document.querySelector("#withdrawtransaction")


const createMyElement = (element, parent, classes="", textContent="",attributes=[])=>{
    const el = document.createElement(element)
    parent.appendChild(el)
    if(classes!="") el.classList = classes
    if(textContent!="") el.textContent = textContent
    attributes.forEach(attribute=>{
    el.setAttribute(attribute.attName, attribute.attrVal)
    })
    return el
}

if(customerData){
    const custStorage=readDataFromStorge()

     customerData.addEventListener("submit",function(event){
         event.preventDefault()
         const customer={}   
         const objArr=[]
         const  cust=readDataFromStorge()

         cusomerMain.forEach(m => {

             if(m.isDefault&&m.default==5000)customer[m.name]=cust.length==0?5000:(cust[cust.length-1].accNum)+1
             else if(!m.dataStore){
                customer[m.name]=m.default()
             }
             else{ 
                 customer[m.name]=this.elements[m.name][m.dataStore]
                }
        })
         customer.transaction=[]
         custStorage.push(customer)
         
         this.reset()

        setDataOfCustomerToStorage(custStorage)
        window.location.replace("Bank.html")

     })
 }
 
drawItems=()=>{
content.innerHTML=""
const customersData=readDataFromStorge()

if(customersData.length==0){
    let tr=createMyElement('tr',content,"alert alert-danger text-center")
     createMyElement('td',tr,"","No Users Yet",[{attrName:"colspan", atrrVal:6}])
}
else{
    
    customersData.forEach((cust,index)=>{
    const tr= createMyElement('tr',content)
   
    cusomerMain.forEach(head=>{  
        if(head.name!='transaction')
        createMyElement('td',tr,"",cust[head.name])
    })

    const td = createMyElement('td',tr)
    const delBtn = createMyElement('button', td, "btn btn-danger mx-3", "delete")
    delBtn.addEventListener("click",(e)=>deleteCustomer(customersData,cust.accNum))

    const editBtn = createMyElement('button', td, "btn btn-warning mx-3", "Edit")
    editBtn.addEventListener('click', (e)=> edit(index))
    const showBtn = createMyElement('button', td, "btn btn-primary mx-3", "Show")
    showBtn.addEventListener("click", (e)=> showSingleCust(cust))

    const AddBalance = createMyElement('button', td, "btn btn-danger mx-3", "ADD Blance")
    AddBalance.addEventListener('click', (e)=> addTransaction(index))
    const withdrawBalance = createMyElement('button', td, "btn btn-primary mx-3", "Withdraw Balance")
    withdrawBalance.addEventListener("click", (e)=> withdrawTransaction(index))
    })    
}
}
if(content)drawItems()

deleteCustomer= (usersData, id) =>{
   
    const newData = usersData.filter(u=> u.accNum != id)
     setDataOfCustomerToStorage(newData)
      drawItems()
}

showSingleCust=(user)=>{
    localStorage.setItem("customer", JSON.stringify(user))
    window.location.replace("singleCustomer.html")
}
    
if(single){
        try
        {
            const customer = JSON.parse(localStorage.getItem("customer"))
            if(!customer) throw new Error()
            const tr = createMyElement('tr',single)
            cusomerMain.forEach( head=>{ 
                if(head.name=="transaction"){
                    customer['transaction'].forEach(el=>{
                        custTransctions.forEach(t=>{
                         createMyElement('td',tr,"",el[t.transactionType])
                         createMyElement('td',tr,"",el[t.value])
                      })
                      })
                }
                else
                createMyElement('td', tr,"",customer[head.name])
            } )
        }
        catch(e){
            const tr = createMyElement('tr',single, "alert alert-danger text-center")
            createMyElement('td', tr,"", "No Users Yet", [{attName:"colspan", attrVal:6}] )      
        }
}

edit=( index)=>{
        localStorage.setItem('editIndexForCustomer', index)
        window.location.replace("editCustomer.html")
}
if(editForm){
    const custData=readDataFromStorge()
    let id = localStorage.getItem('editIndexForCustomer')
    let cust = custData[id]
    
    cusomerMain.forEach(head => {

        if(head.name!='transaction'){
         editForm.elements[head.name][head.dataStore]=cust[head.name]}
    }); 
    editForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        cusomerMain.forEach(head => {
            if(!head.isDefault&&head.name!='transaction') 
            custData[id][head.name]=editForm.elements[head.name][head.dataStore]
        });
       
        setDataOfCustomerToStorage(custData)
       window.location.replace("bank.html")
    }) 
}
addTransaction=(index)=>{
    localStorage.setItem('editIndexForCustomer',index)
    window.location.replace("transaction.html")

 } 
 if(addtran){
    const custData=readDataFromStorge()
    let id = localStorage.getItem('editIndexForCustomer')
    const cust = custData[id]
    
    addtran.addEventListener('submit',(e)=>{
        e.preventDefault()
        let amount =addtran.elements['value']['value']
        let val='ADD'
        let tran={}
        custTransction=
            {transactionType:val, value:amount}     
        
        cust['transaction'].push(custTransction)
        setDataOfCustomerToStorage(custData)
        console.log(alert("Add Successfly"))
        window.location.replace("Bank.html")
    })

 }
 withdrawTransaction=(index)=>{
    localStorage.setItem('editIndexForCustomer',index)
    window.location.replace("withdraw.html")

 }
 if(withdraw){
    const custData=readDataFromStorge()
    let id = localStorage.getItem('editIndexForCustomer')
    let cust = custData[id]
    
    withdraw.addEventListener('submit',(e)=>{
        e.preventDefault()
        let amount =withdraw.elements['value']['value']
        let val='Withdraw'
        custTransction=
            {transactionType:val, value:amount}     
        cust['transaction'].push(custTransction)
        setDataOfCustomerToStorage(custData)
        console.log(alert("Add Successfly"))
        window.location.replace("Bank.html")
    })

 }

