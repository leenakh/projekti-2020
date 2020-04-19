require('dotenv').config()
const express = require('express')
const app = express()

const morgan = require('morgan')
const logger = require('./middlewares/logger')
const error = require('./middlewares/errors')
const cors = require('cors')

app.use(express.json())
//app.use(morgan('dev'))
app.use(logger.requestLogger)
app.use(cors())

const Kissa = require('./models/kissa')

app.get('/', (req, res) => {
    res.send('<p>Hello, kirjastobackend!</p>')
})

app.get('/api/kissat', (req, res, next) => {
    Kissa.find({}).then(kissat => {
        if (kissat) {
            res.json(kissat)
        }
    })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.get('/api/kissat/:id', (req, res, next) => {
    //const id = Number(req.params.id)
    Kissa.findById(req.params.id)
        .then(kissa => {
            if (kissa) {
                res.json(kissa.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.post('/api/kissat', (req, res, next) => {
    /* let i = Math.floor(Math.random() * 10000)
    let date = new Date()
    let month = date.getMonth() + 1 */
    const body = req.body
    if (!body.nimi || !body.ika) {
        return res.status(400).json({
            error: 'Kissa puuttuu!'
        })
    }
    const kissa = new Kissa({
        nimi: body.nimi,
        ika: body.ika
    })

    kissa.save()
        .then(kissa => {
            console.log('Kissa valmis!')
            if (kissa) {
                res.json(kissa.toJSON())
            }
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.put('/api/kissat/:id', (req, res, next) => {
    const body = req.body
    if (!body.nimi || !body.ika) {
        return res.status(400).json({
            error: 'Kissa puuttuu!'
        })
    }
    const muutettuKissa = {
        nimi: body.nimi,
        ika: body.ika
    }

    Kissa.findByIdAndUpdate(req.params.id, muutettuKissa, { new: true })
        .then(uusiKissa => {
            res.json(uusiKissa.toJSON())
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.delete('/api/kissat/:id', (req, res, next) => {
    Kissa.findByIdAndRemove(req.params.id)
        .then(result => {
            if (result) {
                res.status(204).end()
            }
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.use(error.errorHandler)
app.use(error.unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

console.log('Hello, kirjastobackend!')