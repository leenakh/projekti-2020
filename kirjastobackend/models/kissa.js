const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const kissaSchema = new mongoose.Schema({
    nimi: {
        type: String,
        minlength: 2,
        required: true
    },
    ika: {
        type: Number,
        required: true
    }
})

kissaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Kissa', kissaSchema)