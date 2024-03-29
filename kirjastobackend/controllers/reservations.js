const reservationsRouter = require('express').Router()
const Reservation = require('../models/reservation')
const moment = require('moment')
const User = require('../models/user')
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
    res.json(reservations.map(reservation => reservation.toJSON()))
})

reservationsRouter.get('/:id', async (req, res) => {
    const reservation = await Reservation.findById(req.params.id)
    res.json(reservation.toJSON())
})

reservationsRouter.get('/:user/reservations', async (req, res) => {
    const user = await User.find({ username: req.params.user })
    const reservations = await Reservation.find({ user: user[0]._id.toString() })
    res.json(reservations.map(r => r.toJSON()))
})

reservationsRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (moment(body.beginDate).isSameOrBefore(moment(body.endDate))) {
        const reservation = new Reservation({
            beginDate: body.beginDate,
            endDate: body.endDate,
            user: user._id,
            book: body.book,
            numberOfCopies: body.numberOfCopies,
            course: body.course,
            received: false
        })
        const returnedReservation = await reservation.save()
        res.json(returnedReservation.toJSON())
    } else {
        res.status(400).json({ error: 'Reservation begin date must be before end date.' })
    }
})

reservationsRouter.put('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const body = req.body
    const changedReservation = {
        beginDate: body.beginDate,
        endDate: body.endDate,
        received: body.received
    }
    const returnedReservation = await Reservation.findByIdAndUpdate(req.params.id, changedReservation, { new: true })
    res.json(returnedReservation.toJSON())
})

reservationsRouter.delete('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const reservation = await Reservation.findById(req.params.id)
    const reservationOwner = await User.findById(reservation.user)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    } else if (reservationOwner._id.toString() === decodedToken.id) {
        await Reservation.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } else {
        res.status(401).json({ error: 'Oops.' })
    }
})

module.exports = reservationsRouter