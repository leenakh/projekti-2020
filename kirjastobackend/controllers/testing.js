const router = require('express').Router()
const Book = require('../models/book')
const User = require('../models/user')
const Customer = require('../models/customer')
const Loan = require('../models/loan')

router.post('/reset', async (request, response) => {
    await Book.deleteMany({})
    await User.deleteMany({})
    await Customer.deleteMany({})
    await Loan.deleteMany({})
    response.status(204).end()
})

module.exports = router