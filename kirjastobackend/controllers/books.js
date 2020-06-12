const booksRouter = require('express').Router()
const Book = require('../models/book')
const User = require('../models/user')
const Loan = require('../models/loan')
const Reservation = require('../models/reservation')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const moment = require('moment')

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
        .populate('reservations')
        .populate('reservation', { beginDate: 1, endDate: 1, user: 1, received: 1 })
    res.json(books.map(book => book.toJSON()))
})

booksRouter.get('/search/:search', async (req, res) => {
    let books = []
    const search = req.params.search.split('&')
    logger.info(search)
    const firstField = search[0].split('=')
    const secondField = search[1].split('=')
    let fieldsMap = new Map()
    fieldsMap.set(firstField[0], firstField[1])
    fieldsMap.set(secondField[0], secondField[1])
    for (let [key, value] of fieldsMap) {
        logger.info(key, '=', value)
    }
    const searchTitle = fieldsMap.get('title')
    const searchIsbn = fieldsMap.get('isbn')
    logger.info(searchTitle, searchIsbn)
    if (searchIsbn !== '') {
        books = await Book.find({ isbn: searchIsbn })
            .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
    } else {
        books = await Book.find({ title: { $regex: searchTitle, $options: 'i' } })
            .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
    }
    res.json(books.map(book => book.toJSON()))
})

booksRouter.get('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
        .populate('reservations')
        .populate('reservation', { beginDate: 1, endDate: 1, user: 1, received: 1 })
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

const isAvailable = async (book, reservation) => {
    let i = 0
    let toReturn = true
    const bookToReserve = await Book.findById(book.id)
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
        .populate('reservations')
        .populate('reservation', { beginDate: 1, endDate: 1, user: 1, received: 1 })
    console.log('bookToReserve', bookToReserve)
    for (i = 0; i < bookToReserve.reservations.length; i++) {
        //let r = await Reservation.findById(book.reservations[i].id)
        let loanBeginDate = '2000-01-01'
        let loanEndDate = '2000-02-01'
        if (bookToReserve.loan) {
            loanBeginDate = bookToReserve.loan.beginDate
            loanEndDate = bookToReserve.loan.endDate
        }
        let r = bookToReserve.reservations[i]
        result = (moment(reservation.endDate).isBefore(r.beginDate)
            || moment(reservation.beginDate).isAfter(r.endDate))
            && (moment(reservation.endDate).isBefore(loanBeginDate)
                || moment(reservation.beginDate).isAfter(loanEndDate))
        if (result === false) {
            toReturn = result
        }
    }
    console.log('toReturn', toReturn)
    return toReturn
}

booksRouter.post('/availability', async (req, res) => {
    const body = req.body
    //let copies = 0
    let booksToReturn = []
    let i = 0
    console.log('reservationInAvailableCopies', body.reservation)
    console.log('booksInAvailability', body.books)
    //const reservation = await Reservation.findById(body.reservation)
    for (i = 0; i < body.books.length; i++) {
        //let book = await Book.findById(body.books[i])
        let book = body.books[i]
        let result = await isAvailable(book, body.reservation)
        if (result === true) {
            //copies++
            booksToReturn = [...booksToReturn, book]
        }
    }
    console.log('booksToReturn', booksToReturn)
    //res.json({ copies: copies })
    res.json(booksToReturn)
})

booksRouter.put('/:id', async (req, res) => {
    const body = req.body
    let changedBook = null
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    if (body.loanId) {
        const loanToAdd = await Loan.findById(body.loanId)
        const book = await Book.findById(req.params.id)
        const available = await isAvailable(book, loanToAdd)
        if (available === true)
        changedBook = {
            loan: loanToAdd._id
        }
        console.log('loanToAdd', loanToAdd)
    } else if (body.loanId === null) {
        changedBook = {
            loan: null
        }
    } else if (body.reservations) {
        console.log('body.reservations', body.reservations)
        console.log('changedBook backend', changedBook)
        const book = await Book.findById(req.params.id)
        console.log('reservation', body.reservations[body.reservations.length - 1])
        const reservation = await Reservation.findById(body.reservations[body.reservations.length - 1])
        const available = await isAvailable(book, reservation)
        console.log('available', available)
        if (available === true) {
            console.log('available', available)
            changedBook = {
                reservations: body.reservations
            }
        } else {
            return res.status(400).json({ error: 'This copy is not available during requested time period.' })
        }
    }
    const returnedBook = await Book.findByIdAndUpdate(req.params.id, changedBook, { new: true })
        .populate('loan', { beginDate: 1, endDate: 1, customer: 1, returned: 1 })
        .populate('reservations')
        .populate('reservation', { beginDate: 1, endDate: 1, user: 1, received: 1 })
    return res.json(returnedBook.toJSON())
})

booksRouter.delete('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const loggedInUser = await User.findById(decodedToken.id)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    } else if (loggedInUser.username !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    await Book.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

module.exports = booksRouter

