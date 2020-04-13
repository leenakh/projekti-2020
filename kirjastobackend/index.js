const express = require('express')
const app = express()

const morgan = require('morgan')

app.use(express.json())
app.use(morgan('dev'))

let jotain = [
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
    res.json(jotain)
})

app.get('/api/kissat/:id', (req, res) => {
    const id = Number(req.params.id)
    const kissa = jotain.find(kissa => kissa.id === id)

    if (kissa) {
        res.json(kissa)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/kissat/:id', (req, res) => {
    const id = Number(req.params.id)
    jotain = jotain.filter(kissa => kissa.id !== id)

    res.status(204).end()
})

app.post('/api/kissat', (req, res) => {
    const kissa = req.body
    console.log(kissa)

    res.json(kissa)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

console.log('Hello, kirjastobackend!')