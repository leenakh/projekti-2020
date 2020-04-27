const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const loanSchema = new mongoose.Schema({
    beginDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    returned: {
        type: Boolean,
        required: true
    }
})

loanSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Loan', loanSchema)