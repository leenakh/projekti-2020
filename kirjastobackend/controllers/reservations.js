const reservationsRouter = require('express').Router()
const Reservation = require('../models/reservation')
const moment = require('moment')
const User = require('../models/user')
const Book = require('../models/book')
const jwt = require('jsonwebtoken')

getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

reservationsRouter.get('/', async (req, res) => {
    const reservations = await Reservation.find({})
        //.populate('book', { title: 1, authors: 1, languages: 1, isbn: 1, copy: 1 })
    res.json(reservations.map(reservation => reservation.toJSON()))
})

reservationsRouter.get('/:id', async (req, res) => {
    const reservation = await Reservation.findById(req.params.id)
        //.populate('book', { title: 1, authors: 1, languages: 1, isbn: 1, copy: 1 })
    res.json(reservation.toJSON())
})

reservationsRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    //const book = await Book.findById(body.bookId)

    //if (customer.accessAllowed === true && !book.loan) {
        const reservation = new Reservation({
            beginDate: body.beginDate,
            endDate: body.endDate,
            user: user._id,
            book: body.book,
            numberOfCopies: body.numberOfCopies,
            received: false
        })
        const returnedReservation = await reservation.save()
        res.json(returnedReservation.toJSON())
    //} else {
        //res.status(401).json({ error: 'Customer is not allowed access or book is already taken.' })
    //}
})

reservationsRouter.put('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    //const user = await User.findById(decodedToken.id)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const body = req.body
    const changedReservation = {
        beginDate: body.beginDate,
        endDate: body.endDate,
        received: body.received
    }
    const returnedLoan = await Loan.findByIdAndUpdate(req.params.id, changedReservation, { new: true })
    res.json(returnedLoan.toJSON())
})

reservationsRouter.delete('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const reservationOwner = Reservation.findById(req.params.id).user
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    } else if (user._id === reservationOwner._id) {
        await Reservation.findByIdAndDelete(req.params.id)
        res.status(204).end()
    }
})

module.exports = reservationsRouter