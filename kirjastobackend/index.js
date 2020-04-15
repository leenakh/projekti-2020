const express = require('express')
const app = express()

const morgan = require('morgan')
const middlewares = require('./middlewares/logger')
const cors = require('cors')

app.use(express.json())
//app.use(morgan('dev'))
app.use(middlewares.requestLogger)
app.use(cors())

let kissat = [
    {
        'id': 1,
        'nimi': 'Katti Matikainen',
        'ika': 8
    },
    {
        'id': 2,
        'nimi': 'Ville',
        'ika': 12
    },
    {
        'id': 3,
        'nimi': 'Karvinen',
        'ika': 55
    }


]

app.get('/', (req, res) => {
    res.send('<p>Hello, kirjastobackend!</p>')
})

app.get('/api/kissat', (req, res) => {
    res.json(kissat)
})

app.get('/api/kissat/:id', (req, res) => {
    const id = Number(req.params.id)
    const kissa = kissat.find(kissa => kissa.id === id)

    if (kissa) {
        res.json(kissa)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/kissat/:id', (req, res) => {
    const id = Number(req.params.id)
    kissat = kissat.filter(kissa => kissa.id !== id)

    res.status(204).end()
})

app.post('/api/kissat', (req, res) => {
    let i = Math.floor(Math.random() * 10000)
    let date = new Date()
    let month = date.getMonth() + 1
    const body = req.body
    if (!body.nimi || !body.ika) {
        return res.status(400).json({
            error: 'Kissa puuttuu!'
        })
    }
    const kissa = {
        nimi: body.nimi,
        ika: body.ika,
        date: date.getDate() + '.' + month + '.' + date.getFullYear() + ' klo ' + date.getHours() + '.' + date.getMinutes(),
        id: i
    }

    kissat = kissat.concat(kissa)
    console.log(kissa)
    res.json(kissa)
})

app.put('/api/kissat/:id', (req, res) => {
    const id = Number(req.params.id)
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
    kissat = kissat.map(kissa => kissa.id !== id ? kissa : muutettuKissa)
    console.log('uusi kissalista', kissat)
    res.json(muutettuKissa)

})

app.use(middlewares.unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

console.log('Hello, kirjastobackend!')