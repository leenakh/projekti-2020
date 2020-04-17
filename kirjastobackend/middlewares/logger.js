const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('Status: ', response.statusCode)
    console.log('---')
    next()
  }

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'Kissa eksyksissä!'})
}

  module.exports = {
      requestLogger,
      unknownEndpoint
    }   