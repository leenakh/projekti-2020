const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useCreateIndex', true)

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minlength: 5,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        minlength: 2,
        required: true
    },
    lastName: {
        type: String,
        minlength: 2,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)
const User = mongoose.model('User', userSchema)

module.exports = User