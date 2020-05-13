const router = require('express').Router()
const Book = require('../models/book')
const User = require('../models/user')
const Customer = require('../models/customer')
const Loan = require('../models/loan')
const bcrypt = require('bcrypt')

router.post('/bookdata', async (req, res) => {
    await Book.insertMany(req.body)
    res.status(204).end()
})

router.post('/user', async (req, res) => {
    const body = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User ({
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        passwordHash
    })
    await user.save()
    res.status(204).end()
})

router.post('/reset', async (req, res) => {
    await User.deleteMany({})
    await Book.deleteMany({})
    await Customer.deleteMany({})
    await Loan.deleteMany({})
    res.status(204).end()
})

module.exports = router