const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const calendarSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

calendarSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Calendar', calendarSchema)