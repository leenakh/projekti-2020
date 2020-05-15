const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

usersRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const loggedInUser = await User.findById(decodedToken.id)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    } else if (loggedInUser.username !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const body = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        passwordHash
    })

    const savedUser = await user.save()
    res.json(savedUser)
})

module.exports = usersRouter