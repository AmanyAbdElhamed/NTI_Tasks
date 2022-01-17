const router=require('express').Router()
const Customer=require('../controller/app.controlers')
router.get('/',Customer.showAll)

router.get('/addPost',Customer.AddCustomer)
router.post('/addPost',Customer.addCustomerLogic)

router.get('/single/:id',Customer.singleCustomer)

router.get('/edit/:id',Customer.editCustomer)
router.post('/edit/:id',Customer.editLogic)

router.get('/delete/:id',Customer.deletCustomer)

router.get('/transactions/:id',Customer.addTransaction)
router.post('/transactions/:id',Customer.addTransactionLogic)

router.get('/showTransation/:id',Customer.showTransaction)
router.get('/DeleteTransation/:idTran/:id',Customer.deletTransaction)




module.exports=router