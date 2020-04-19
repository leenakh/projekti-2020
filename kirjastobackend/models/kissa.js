const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
    console.log('Yhdistettiin MongoDB:hen.')
})
.catch((error) => {
console.log('Tapahtui virhe yhdistettäessä MongoDB:hen:', error.message)
})

const kissaSchema = new mongoose.Schema({
    nimi: String,
    ika: Number
})

kissaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Kissa', kissaSchema)