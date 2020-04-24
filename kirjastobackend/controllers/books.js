const booksRouter = require('express').Router()
const Book = require('../models/book')
const User = require('../models/user')
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
    res.json(books.map(book => book.toJSON()))
})

booksRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id) {
        return res.status(401).json({error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)

    const book = new Book({
        title: body.title,
        authors: body.authors,
        languages: body.languages
    })
    const returnedBook = await book.save()
    res.json(returnedBook.toJSON())
})

module.exports = booksRouter

