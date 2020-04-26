const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const kissaRouter = require('./controllers/kissaRouter')
const booksRouter = require('./controllers/books')
const loansRouter = require('./controllers/loans')
const usersRouter = require('./controllers/users')
const customersRouter = require('./controllers/customers')
const loginRouter = require('./controllers/login')
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

app.use('/api/kissat', kissaRouter)
app.use('/api/books', booksRouter)
app.use('/api/loans', loansRouter)
app.use('/api/users', usersRouter)
app.use('/api/customers', customersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
