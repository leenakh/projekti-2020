customersRouter = require('express').Router()
const Customer = require('../models/customer')
const Loan = require('../models/loan')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
}

customersRouter.get('/', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        res.status(401).json({ error: 'token missing or invalid' })
    }
    const customers = await Customer.find({})
    res.json(customers.map(customer => customer.toJSON()))
})

customersRouter.get('/search/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        res.status(401).json({ error: 'token missing or invalid' })
    }
    const customers = await Customer.find({username: req.params.id})
    res.json(customers.map(customer => customer.toJSON()))
})

customersRouter.get('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        res.status(401).json({ error: 'token missing or invalid' })
    }
    const customer = await Customer.findOne({ username: req.params.id })
    res.json(customer.toJSON())
})

customersRouter.get('/:id/loans', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        res.status(401).json({ error: 'token missing or invalid' })
    }
    const customersLoans = await Loan.find({ customer: req.params.id })
        .populate('book', { title: 1, authors: 1, copy: 1 })
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
        username: body.username,
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
    const customer = await Customer.findOne({ username: req.params.id })
    const id = customer._id.toString()
    const changedCustomer = {
        accessAllowed: body.accessAllowed
    }
    const returnedCustomer = await Customer.findByIdAndUpdate(id, changedCustomer, { new: true })
    res.json(returnedCustomer.toJSON())
})

module.exports = customersRouter