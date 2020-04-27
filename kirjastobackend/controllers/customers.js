customersRouter = require('express').Router()
const Customer = require('../models/customer')
const Loan = require('../models/loan')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
}

customersRouter.get('/', async (req, res) => {
    const customers = await Customer.find({})
    res.json(customers.map(customer => customer.toJSON()))
})

customersRouter.get('/:id', async (req, res) => {
    const customer = await Customer.findOne({email: req.params.id})
    res.json(customer.toJSON())
})

customersRouter.get('/:id/loans', async (req, res) => {
    const customersLoans = await Loan.find({ customer: req.params.id })
    res.json(customersLoans.map(loan => loan.toJSON()))
})

customersRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        res.status(401).json({ error: 'token missing or invalid' })
    }

    const customer = new Customer({
        email: body.email,
        accessAllowed: true
    })
    const returnedCustomer = await customer.save()
    res.json(returnedCustomer.toJSON())
})

customersRouter.put('/:id', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        res.status(401).json({ error: 'token missing or invalid' })
    }
    const changedCustomer = {
        accessAllowed: body.accessAllowed
    }
    const returnedCustomer = await Customer.findByIdAndUpdate(req.params.id, changedCustomer, { new: true })
    res.json(returnedCustomer.toJSON())
})

module.exports = customersRouter