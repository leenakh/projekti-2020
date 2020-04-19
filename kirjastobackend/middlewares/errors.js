const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'ReferenceError') {
        return res.status(404).send({error: 'Kissoja ei löytynyt.'})
    } else if (error.name === 'CastError') {
            return res.status(400).send({error: 'Malformatted request'})
        }

    

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'Kissa eksyksissä!'})
}

module.exports = {
    errorHandler,
    unknownEndpoint
}