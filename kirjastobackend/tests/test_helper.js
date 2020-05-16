const Book = require('../models/book')
const Loan = require('../models/loan')

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

const loansInDatabase = async () => {
    const loans = await Loan.find({})
    return loans.map(loan => loan.toJSON())
}

module.exports = {
    initialBooks, booksInDatabase, loansInDatabase
}