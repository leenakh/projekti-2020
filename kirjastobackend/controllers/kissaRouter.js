const kissaRouter = require('express').Router()
const Kissa = require('../models/kissa')

kissaRouter.get('/', async (req, res, next) => {
    const kissat = await Kissa.find({})
    res.json(kissat.map(kissa => kissa.toJSON()))
})

kissaRouter.get('/:id', async (req, res, next) => {
        const kissa = await Kissa.findById(req.params.id)
        res.json(kissa.toJSON())
})

kissaRouter.post('/', async (req, res, next) => {
    const body = req.body
    const kissa = new Kissa({
        nimi: body.nimi,
        ika: body.ika
    })
        const palautettuKissa = await kissa.save()
        res.json(palautettuKissa.toJSON())
})

kissaRouter.put('/:id', async (req, res, next) => {
    const body = req.body
    const muutettuKissa = {
        nimi: body.nimi,
        ika: body.ika
    }
        const palautettuKissa = await Kissa.findByIdAndUpdate(req.params.id, muutettuKissa, { new: true })
        res.json(palautettuKissa.toJSON())
})

kissaRouter.delete('/:id', async (req, res, next) => {
        await Kissa.findByIdAndRemove(req.params.id)
        res.status(204).end()
})

module.exports = kissaRouter