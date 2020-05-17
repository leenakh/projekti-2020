const Book = require('../models/book')
const Loan = require('../models/loan')
const Customer = require('../models/customer')

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

const customersInDatabase = async () => {
    const customers = await Customer.find({})
    return customers.map(customer => customer.toJSON())
}

const getCustomer = async () => {
    const customerToFind = await Customer.find({username: customer.username})
    return customerToFind[0]
}

const user = {
    username: 'testaaja', password: 'testaaja'
}

const admin = {
    username: 'admin', password: 'admin'
}

const customer = {
    username: 'katti',
    accessAllowed: true
}

module.exports = {
    initialBooks,
    booksInDatabase,
    loansInDatabase,
    user,
    admin,
    customer,
    customersInDatabase,
    getCustomer
}