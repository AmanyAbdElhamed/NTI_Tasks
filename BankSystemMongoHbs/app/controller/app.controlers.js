const dbConnection = require('../../models/dbcon')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectId
var uniqid = require('uniqid')
const ValiadtorController = require('./validator.controller')
class Customer {
    static showAll = (req, res) => {

        dbConnection((err, client, db) => {
            db.collection('customer').find().toArray((error, result) => {
                if (error) return redirect('/err')
                const data = result
                const isEmpty = data.length == 0
                client.close()
                res.render("all", { pageTitle: "All Customers", data, isEmpty })
            })
        })
    }
    static AddCustomer = (req, res) => {
        const customer = ['name', 'email', 'adress', 'phone', 'intialBalance', 'transactions']
        res.render('addPost', { PageTitle: 'Add New Customer', customer, errors: {} })
    }
    static addCustomerLogic = (req, res) => {
        let customer = req.body
        let errors = {}
        const transactions = []

        if (!ValiadtorController.isEmptyString(customer.name))
            errors.name = "name is required"

        if (!ValiadtorController.isValidEmail(customer.email))
            errors.email = "enter a valid mail"

        if (!ValiadtorController.isValidPhone(customer.phone))
            errors.phone = "enter a valid phone"
        if (ValiadtorController.isValidNumber(customer.intialBalance))
            errors.intialBalance = "enter a valid Balance"

        if (Object.keys(errors).length > 0) {

            return res.render('addPost', {
                pageTitle: "add new Customer",
                errors,
                customer
            })
        }

        customer.transactions=transactions
        dbConnection((err, client, db) => {
            db.collection('customer').insertOne(customer, (error, result) => {
                if (err) return res.redirect("/err")
                client.close()
                res.redirect("/")
            })
        })

    }
    
    static searchTransactionByID = (id, data) => {
        let tranIndex = data.findIndex(el => el._id == id)
        return tranIndex
    }
    static singleCustomer = (req, res) => {
        const id = req.params.id
        dbConnection((err, client, db) => {
            db.collection('customer').findOne(
                { _id: new ObjectId(id) },
                (error, result) => {
                    if (err) return res.redirect("/err")
                    client.close()
                    res.render("single", {
                        pageTitle: "Customers Details",
                        customer: result
                    })
                    // res.redirect("/")
                })
        })
    }
    static editCustomer = (req, res) => {
        const id = req.params.id
        dbConnection((err, client, db) => {
            db.collection('customer').findOne(
                { _id: new ObjectId(id) },
                (error, result) => {
                    if (err) return res.redirect("/err")
                    client.close()
                    res.render("edit", {
                        pageTitle: "Edit Customers Details",
                        customer: result
                    })
                    // res.redirect("/")
                })
        })

    }
    static editLogic = (req, res) => {
        const id = req.params.id
        const customer = req.body
        const errors = {}
        if (!ValiadtorController.isEmptyString(customer.name))
            errors.name = "name is required"

        if (!ValiadtorController.isValidEmail(customer.email))
            errors.email = "enter a valid mail"

        if (!ValiadtorController.isValidPhone(customer.phone))
            errors.phone = "enter a valid phone"
        if (ValiadtorController.isValidNumber(customer.intialBalance))
            errors.intialBalance = "enter a valid Balance"

        if (Object.keys(errors).length > 0) {
            return res.render('edit', {
                pageTitle: "Edit Customer",
                errors,
                customer
            })
        }

        dbConnection((err, client, db) => {
            db.collection('customer').updateOne({_id:ObjectId(id)}, { $set: { ...req.body } })
                .then(result => {
                    client.close()
                    res.redirect('/')
                })
                .catch(error => {
                    client.close()
                    return error.redirect("/err")
                })
        })
    }
    static deletCustomer = (req, res) => {
        const id = req.params.id
        dbConnection((err, client, db) => {
            db.collection('customer').deleteOne({ _id: new ObjectId(id) })
                .then(resp => {
                    
                    client.close()
                    res.redirect("/")
                })
                .catch(error => {
                    client.close()
                    return error.redirect("/err")
                })
        })
    }

    static addTransaction = (req, res) => {
        const id = req.params.id
        dbConnection((err, client, db) => {
            db.collection('customer').findOne(
                { _id: new ObjectId(id) },
                (error, result) => {
                    if (err) return res.redirect("/err")
                    client.close()
                    const data = result
                    const isEmpty = data.length == 0
                    return res.render('transaction', {
                        PageTitle: 'Transaction of Customer',
                        customer: result,
                        isEmpty
                    })
                    
                })
        })
    
    
}
    static addTransactionLogic = (req, res) => {
    const tran = req.body
    const id = req.params.id
    const errors = {}
    // if (ValiadtorController.isValidNumber(tran.value))
    // errors.value = "enter a valid Balance"
     let num=Date.now()
     num=num.toString()
    dbConnection((err, client, db) => {
    db.collection('customer').updateOne({_id:ObjectId(id)}, { $push: {transactions:{_id:num,...req.body}}  })
        .then(result => {
                client.close()
                res.redirect('/')
            })
            .catch(error => {
                client.close()
                return error.redirect("/err")
            })
    })


 }
    static showTransaction = (req, res) => {
        
        const id = req.params.id
        dbConnection((err, client, db) => {
            db.collection('customer').findOne(
                { _id: new ObjectId(id) },//{projection:{transactions:1}},
                (error, result) => {
                    if (err) return res.redirect("/err")
                    client.close()
                    const data = result.transactions
                    const isEmpty = data.length == 0
                    res.render('showTransaction', 
                    { PageTitle: 'All Transactions',
                    tranData: result.transactions ,
                    id,isEmpty
                 })
                    // res.redirect("/")
                })
        })
}
    static deletTransaction = (req, res) => {
    const id = req.params.id
    const idTran = req.params.idTran
    console.log(idTran)
    dbConnection((err, client, db) => {
        db.collection('customer').updateOne({_id:ObjectId(id)}, { $pull: {transactions:{_id:idTran}}})
            .then(result => {
                console.log(result)
                    client.close()
                    res.redirect('/')
                })
                .catch(error => {    
                client.close()
                return error.redirect("/err")
                })
        })
}
}
module.exports = Customer