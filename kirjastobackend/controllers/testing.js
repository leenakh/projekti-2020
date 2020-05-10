const router = require('express').Router()
const Book = require('../models/book')
const User = require('../models/user')
const Customer = require('../models/customer')
const Loan = require('../models/loan')

router.post('/bookdata', async (req, res) => {
    await Book.insertMany(req.body)
    res.status(204).end()
})

router.post('/reset', async (req, res) => {
    await Book.deleteMany({})
    await Customer.deleteMany({})
    await Loan.deleteMany({})
    res.status(204).end()
})

module.exports = router