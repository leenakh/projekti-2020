const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const kissaRouter = require('./controllers/kissaRouter')
const booksRouter = require('./controllers/books')
const loansRouter = require('./controllers/loans')
const Loan = require('./models/loan')
const usersRouter = require('./controllers/users')
const customersRouter = require('./controllers/customers')
const Customer = require('./models/customer')
const loginRouter = require('./controllers/login')
const reservationsRouter = require('./controllers/reservations')
const calendarRouter = require('./controllers/calendar')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

logger.info('Yhdistetään MongoDB:hen.')

const url = config.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        logger.info('Yhdistettiin MongoDB:hen.')
    })
    .catch((error) => {
        logger.error('Tapahtui virhe yhdistettäessä MongoDB:hen:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use('/api/kissat', kissaRouter)
app.use('/api/books', booksRouter)
app.use('/api/loans', loansRouter)
app.use('/api/users', usersRouter)
app.use('/api/customers', customersRouter)
app.use('/api/login', loginRouter)
app.use('/api/reservations', reservationsRouter)
app.use('/api/calendar', calendarRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

const setAccessDenied = async () => {
    const customersList = await Customer.find({})
    const customers = customersList.map(c => c.toJSON())
    for (let customer of customers) {
        let loansDue = false
        const loansList = await Loan.find({ customer: customer.username })
        const loans = loansList.map(l => l.toJSON())
        for (let loan of loans) {
            if (new Date().getTime() - new Date(loan.endDate).getTime() >= 86400000 && loan.returned === false) {
                loansDue = true
            }
        }
        const changedCustomer = { ...customer, accessAllowed: !loansDue }
        try {
            const returnedCustomer = await Customer.findByIdAndUpdate(changedCustomer.id, changedCustomer, { new: true })
            console.log('returnedCustomer', returnedCustomer)
        } catch (exception) {
            console.log('Pieleen meni.', returnedCustomer)
        }
    }
}

const recuringEvent = () => {
    setAccessDenied()
    setTimeout(() => {
        recuringEvent()
    }, 86400000)
}
recuringEvent()

module.exports = app
