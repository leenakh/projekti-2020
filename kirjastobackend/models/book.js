const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authors: [{
        type: Object,
        required: true
    }],
    languages: [{
        type: String,
        required: true
    }],
    isbn: {
        type: String,
        minlength: 10,
        maxlength: 13,
        required: true
    },
    copy: {
        type: String,
        required: true
    },
    loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan'
    },
    reservations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
    }]
})

bookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Book', bookSchema)