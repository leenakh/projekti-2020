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
    console.log('calendarEntries', calendarEntries)
    res.json(calendarEntries.map(c => c.toJSON()))
})

calendarRouter.get('/:search', async (req, res) => {
    const title = req.params.search
    const calendar = await Calendar.find({ title: title })
    console.log('calendar', calendar)
    res.json(calendar.map(c => c.toJSON()))
})

calendarRouter.post('/', async (req, res) => {
    const body = req.body
    const title = body.title
    const reservation = body.reservation
    let calendarEntries = []
    let date = reservation.beginDate
    let newDate = date
    while (moment(newDate).isSameOrBefore(reservation.endDate)) {
        let calendarEntry = new Calendar({
            date: newDate,
            title: title
        })
        let returnedEntry = await calendarEntry.save()
        calendarEntry = calendarEntries.concat(returnedEntry)
        newDate = moment(newDate).add(1, 'day').format('YYYY-MM-DD')
        console.log('newDate', newDate)
    }
    res.json(calendarEntries.map(c => c.toJSON()))
})

/* calendarRouter.post('/', async (req, res) => {
    const body = req.body
    const calendarEntry = new Calendar({
        date: body.date,
        title: body.title
    })
    const returnedEntry = await calendarEntry.save()
    res.json(returnedEntry.toJSON())
}) */

module.exports = calendarRouter