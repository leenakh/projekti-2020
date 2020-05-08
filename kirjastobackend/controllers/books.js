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
    let books = []
    const search = req.params.title.split('&')
    console.log(search)
    const firstField = search[0].split('=')
    const secondField = search[1].split('=')
    let fieldsMap = new Map()
    fieldsMap.set(firstField[0], firstField[1])
    fieldsMap.set(secondField[0], secondField[1])
    for (let [key, value] of fieldsMap) {
        console.log(key, '=', value)
    }
    const searchTitle = fieldsMap.get('title')
    const searchIsbn = fieldsMap.get('isbn')
    console.log(searchTitle, searchIsbn)
    if (searchIsbn !== '') {
        books = await Book.find({ isbn: searchIsbn })
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 }) 
    } else {
        books = await Book.find({ title: { $regex: searchTitle, $options: 'i' } })
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
    }
    
    console.log(books.map(book => book.toJSON()))
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
    let changedBook = null
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    if (body.loanId !== null) {
        const loan = await Loan.findById(body.loanId)
        changedBook = {
            loan: loan._id
        }
    } else {
        changedBook = {
            loan: null
        }
    }
    const returnedBook = await Book.findByIdAndUpdate(req.params.id, changedBook, { new: true })
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
    res.json(returnedBook.toJSON())
})

module.exports = booksRouter

