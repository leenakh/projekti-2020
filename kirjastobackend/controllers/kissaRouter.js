const kissaRouter = require('express').Router()
const Kissa = require('../models/kissa')

kissaRouter.get('/', (req, res, next) => {
    Kissa.find({}).then(kissat => {
        if (kissat) {
            res.json(kissat)
        }
    })
        .catch(error => {
            next(error)
        })
})

kissaRouter.get('/:id', (req, res, next) => {
    Kissa.findById(req.params.id)
        .then(kissa => {
            if (kissa) {
                res.json(kissa.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

kissaRouter.post('/', (req, res, next) => {
    const body = req.body
    const kissa = new Kissa({
        nimi: body.nimi,
        ika: body.ika
    })

    kissa.save()
        .then(kissa => {
            if (kissa) {
                res.json(kissa.toJSON())
            }
        })
        .catch(error => {
            next(error)
        })
})

kissaRouter.put('/:id', (req, res, next) => {
    const body = req.body
    const muutettuKissa = {
        nimi: body.nimi,
        ika: body.ika
    }
    Kissa.findByIdAndUpdate(req.params.id, muutettuKissa, { new: true })
        .then(uusiKissa => {
            res.json(uusiKissa.toJSON())
        })
        .catch(error => {
            next(error)
        })
})

kissaRouter.delete('/:id', (req, res, next) => {
    Kissa.findByIdAndRemove(req.params.id)
        .then(result => {
            if (result) {
                res.status(204).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

module.exports = kissaRouter