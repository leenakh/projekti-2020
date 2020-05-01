const booksRouter = require('express').Router()
const Book = require('../models/book')
const User = require('../models/user')
const Loan = require('../models/loan')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

booksRouter.get('/', async (req, res) => {
    const books = await Book.find({})
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
    res.json(books.map(book => book.toJSON()))
})

booksRouter.get('/isbn/:isbn', async (req, res) => {
    const books = await Book.find({ isbn: req.params.isbn })
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
    res.json(books.map(book => book.toJSON()))
})

booksRouter.get('/title/:title', async (req, res) => {
    const books = await Book.find({ title: { $regex: req.params.title, $options: 'i' } })
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
    res.json(books.map(book => book.toJSON()))
})

booksRouter.get('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
    res.json(book.toJSON())
})

booksRouter.get('/:id/loans', async (req, res) => {
    const book = await Book.findById(req.params.id)
    const booksLoans = await Loan.find({ book: book._id })
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
    res.json(booksLoans.map(loan => loan.toJSON()))
})

booksRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if (user.username !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const existingBooks = await Book.find({ isbn: body.isbn })
    const copyExists = existingBooks.find(book => book.copy === body.copy)

    if (!copyExists) {
        const book = new Book({
            title: body.title,
            authors: body.authors,
            languages: body.languages,
            isbn: body.isbn,
            copy: body.copy
        })
        const returnedBook = await book.save()
        res.json(returnedBook.toJSON())
    } else {
        return res.status(400).json({ error: 'This copy already exists in the database' })
    }
})

booksRouter.put('/:id', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const loan = await Loan.findById(body.loanId)
    const changedBook = {
        loan: loan._id
    }
    const returnedBook = await Book.findByIdAndUpdate(req.params.id, changedBook, { new: true })
    res.json(returnedBook.toJSON())
})

module.exports = booksRouter

