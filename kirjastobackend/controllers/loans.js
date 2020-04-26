const loansRouter = require('express').Router()
const Loan = require('../models/loan')
const moment = require('moment')
const User = require('../models/user')
const Customer = require('../models/customer')
const Book = require('../models/book')
const jwt = require('jsonwebtoken')

getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

loansRouter.get('/', async (req, res) => {
    const loans = await Loan.find({})
    res.json(loans.map(loan => loan.toJSON()))
})

loansRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)
    const customer = await Customer.findById(body.customerId)
    const book = await Book.findById(body.bookId)

    const loan = new Loan({
        beginDate: body.beginDate,
        endDate: body.endDate,
        customer: customer._id,
        book: book._id
    })
    const returnedLoan = await loan.save()
    res.json(returnedLoan.toJSON())
})

module.exports = loansRouter