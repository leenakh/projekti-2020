customersRouter = require('express').Router()
const Customer = require('../models/customer')
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

customersRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        res.status(401).json({ error: 'token missing or invalid' })
    }

    const customer = new Customer({
        firstName: body.firstName,
        lastName: body.lastName,
        class: body.class,
        accessAllowed: true
    })
    const returnedCustomer = await customer.save()
    res.json(returnedCustomer.toJSON())
})

module.exports = customersRouter