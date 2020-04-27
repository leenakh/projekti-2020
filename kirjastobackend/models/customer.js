const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    accessAllowed: {
        type: Boolean,
        required: true
    }
})

customerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Customer', customerSchema)