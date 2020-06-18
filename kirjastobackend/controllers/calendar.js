const calendarRouter = require('express').Router()
const Calendar = require('../models/calendar')
const User = require('../models/user')
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

calendarRouter.get('/', async (req, res) => {
    const calendarEntries = await Calendar.find({})
        .populate('user', { username: 1, firstName: 1, lastName: 1 })
    console.log('calendarEntries', calendarEntries)
    res.json(calendarEntries.map(c => c.toJSON()))
})

calendarRouter.get('/:id', async (req, res) => {
    const calendarEntry = await Calendar.findById(req.params.id)
        .populate('user', { username: 1, firstName: 1, lastName: 1 })
    res.json(calendarEntry.toJSON())
})

calendarRouter.get('/search/:search', async (req, res) => {
    const title = req.params.search
    const calendar = await Calendar.find({ title: title })
        .populate('user', { username: 1, firstName: 1, lastName: 1 })
    console.log('calendar', calendar)
    res.json(calendar.map(c => c.toJSON()))
})

calendarRouter.post('/', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        res.status(401).json({ error: 'Token missing or invalid.' })
    }
    const body = req.body
    const title = body.title
    const reservation = body.reservation
    const user = await User.findById(decodedToken.id)
    let calendarEntries = []
    let date = reservation.beginDate
    let newDate = date
    while (moment(newDate).isSameOrBefore(reservation.endDate)) {
        let calendarEntry = new Calendar({
            date: newDate,
            title: title,
            reservation: reservation.id,
            user: user._id
        })
        let returnedEntry = await calendarEntry.save()
        calendarEntry = calendarEntries.concat(returnedEntry)
        newDate = moment(newDate).add(1, 'day').format('YYYY-MM-DD')
        console.log('newDate', newDate)
    }
    res.json(calendarEntries.map(c => c.toJSON()))
})

calendarRouter.delete('/:id', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const calendarEntry = await Calendar.findById(req.params.id)
    const user = await User.findById(calendarEntry.user)
    console.log('calendarEntry.user', calendarEntry.user)
    console.log('decodedToken.id', decodedToken.id)
    if (!token || !decodedToken.id) {
        res.status(401).json({ error: 'Token missing or invalid.' })
    } else if (decodedToken.id === user._id.toString()) {
        await Calendar.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } else {
        res.status(401).json({error: 'Unauthorized'})
    }
})


module.exports = calendarRouter