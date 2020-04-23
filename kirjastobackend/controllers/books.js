const booksRouter = require('express').Router()
const Book = require('../models/book')
const User = require('../models/user')
const jwt = require(jsonwebtoken)

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

booksRouter.get('/', async (req, res) => {
    const books = await Book.find({})
    res.json(books.map(book => book.toJSON()))
})

booksRouter.post('/', async (req, res) => {
    const body = req.body
    const book = new Book({
        title: body.title,
        authors: body.authors.primary,
        language: body.language,
        isbn: body.isbn === undefined ? 0000000000000 : body.isbn
    })
})

