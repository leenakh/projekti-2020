const loansRouter = require('express').Router()
const Loan = require('../models/loan')
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
        .populate('book', { title: 1, authors: 1, languages: 1, isbn: 1, copy: 1 })
    res.json(loans.map(loan => loan.toJSON()))
})

loansRouter.get('/:id', async (req, res) => {
    const loan = await Loan.findById(req.params.id)
        .populate('book', { title: 1, authors: 1, languages: 1, isbn: 1, copy: 1 })
    res.json(loan.toJSON())
})

loansRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const customer = await Customer.findOne({ username: body.customerId })
    const book = await Book.findById(body.bookId)

    if (customer.accessAllowed === true && !book.loan) {
        const loan = new Loan({
            beginDate: body.beginDate,
            endDate: body.endDate,
            customer: body.customerId,
            book: book._id,
            returned: false
        })
        const returnedLoan = await loan.save()
        res.json(returnedLoan.toJSON())
    } else {
        res.status(401).json({ error: 'Customer is not allowed access or book is already taken.' })
    }
})

loansRouter.put('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const body = req.body
    const changedLoan = {
        endDate: body.endDate,
        returned: body.returned
    }
    const returnedLoan = await Loan.findByIdAndUpdate(req.params.id, changedLoan, { new: true })
    res.json(returnedLoan.toJSON())
})

loansRouter.delete('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    await Loan.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

module.exports = loansRouter