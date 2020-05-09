const Book = require('../models/book')

const initialBooks = [
    {
        title: 'Testikirja',
        authors: ['Kaija Kirjailija'],
        languages: ['fi'],
        isbn: '0101010101010',
        copy: '1'
    },
    {
        title: 'Toinen testikirja',
        authors: ['Kaija Kirjailija'],
        languages: ['fi'],
        isbn: '0101010101011',
        copy: '2'
    },
    {
        title: 'Ihan erilainen kirja',
        authors: ['Kaija Kirjailija'],
        languages: ['fi'],
        isbn: '0101010101013',
        copy: '1'
    }
]

const booksInDatabase = async () => {
    const books = await Book.find({})
    return books.map(book => book.toJSON())
}

module.exports = {
    initialBooks, booksInDatabase
}