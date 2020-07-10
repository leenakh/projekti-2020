const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const reservationSchema = new mongoose.Schema({
    beginDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: String,
        required: true
    },
    numberOfCopies: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    received: {
        type: Boolean,
        required: true
    }
})

reservationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Reservation', reservationSchema)