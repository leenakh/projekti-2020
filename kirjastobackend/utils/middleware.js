const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')
    next()
  }

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'ReferenceError' || error.name === 'TypeError') {
        return res.status(404).send({ error: 'Kissoja ei löytynyt.' })
    } else if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Malformatted request' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({error: 'invalid token'})
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Kissa eksyksissä!' })
}

module.exports = {
    errorHandler,
    unknownEndpoint,
    requestLogger
}