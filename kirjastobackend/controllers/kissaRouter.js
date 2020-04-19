const kissaRouter = require('express').Router()
const Kissa = require('../models/kissa')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

kissaRouter.get('/', async (req, res) => {
    const kissat = await Kissa.find({})
    res.json(kissat.map(kissa => kissa.toJSON()))
})

kissaRouter.get('/:id', async (req, res) => {
        const kissa = await Kissa.findById(req.params.id)
        res.json(kissa.toJSON())
})

kissaRouter.post('/', async (req, res) => {
    const body = req.body
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id) {
        return res.status(401).json({error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)

    const kissa = new Kissa({
        nimi: body.nimi,
        ika: body.ika
    })
        const palautettuKissa = await kissa.save()
        res.json(palautettuKissa.toJSON())
})

kissaRouter.put('/:id', async (req, res) => {
    const body = req.body
    const muutettuKissa = {
        nimi: body.nimi,
        ika: body.ika
    }
        const palautettuKissa = await Kissa.findByIdAndUpdate(req.params.id, muutettuKissa, { new: true })
        res.json(palautettuKissa.toJSON())
})

kissaRouter.delete('/:id', async (req, res) => {
        await Kissa.findByIdAndRemove(req.params.id)
        res.status(204).end()
})

module.exports = kissaRouter