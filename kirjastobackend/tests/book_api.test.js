const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Book = require('../models/book')
const Loan = require('../models/loan')
const Customer = require('../models/customer')

describe('some books initially in the database', () => {
    beforeEach(async () => {
        await Book.deleteMany({})
        await Loan.deleteMany({})
        await Customer.deleteMany({})
        await Book.insertMany(helper.initialBooks)
    })

    test('all the books are returned', async () => {
        await api
            .get('/api/books')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('right number of books is returned', async () => {
        const response = await helper.booksInDatabase()
        expect(response).toHaveLength(helper.initialBooks.length)
    })

    test('a specific book is returned', async () => {
        const response = await helper.booksInDatabase()
        const titles = response.map(book => book.title)
        expect(titles).toContainEqual('Testikirja')
    })

    test('a specific book can be viewed', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToView = booksAtStart[0]
        const resultBook = await api
            .get(`/api/books/${bookToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(resultBook.body).toEqual(bookToView)
    })

    test('book with spesific isbn is returned', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToFind = booksAtStart[0]
        const search = `isbn=${bookToFind.isbn}&title=`
        const foundBooks = await api
            .get(`/api/books/search/${search}`)
            .expect(200)
        const isbns = foundBooks.body.map(book => book.isbn)
        expect(isbns).toContainEqual(bookToFind.isbn)
        expect(isbns).not.toContainEqual(booksAtStart[1].isbn)
    })

    test('book with spesific title is returned', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToFind = booksAtStart[2]
        const search = `title=${bookToFind.title}&isbn=`
        const foundBooks = await api
            .get(`/api/books/search/${search}`)
            .expect(200)
        const titles = foundBooks.body.map(book => book.title)
        expect(titles).toContainEqual(bookToFind.title)
        expect(titles).not.toContainEqual(booksAtStart[1].title)
    })

    test('books with common part of title are returned', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToFind = booksAtStart[0]
        const search = `title=${bookToFind.title}&isbn=`
        const foundBooks = await api
            .get(`/api/books/search/${search}`)
            .expect(200)
        const titles = foundBooks.body.map(book => book.title)
        expect(titles).toHaveLength(2)
        expect(titles).toContainEqual(bookToFind.title)
        expect(titles).not.toContainEqual(booksAtStart[2].title)
    })

    test('book can be deleted by admin', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToDelete = booksAtStart[0]
        const auth = await api.post('/api/login')
            .send(helper.admin)
        await api
            .delete(`/api/books/${bookToDelete.id}`)
            .set('Authorization', `bearer ${auth.body.token}`)
            .expect(204)
        const booksAtEnd = await helper.booksInDatabase()
        expect(booksAtEnd).toHaveLength(booksAtStart.length - 1)
        const titles = booksAtEnd.map(book => book.title)
        expect(titles).not.toContainEqual(bookToDelete.title)
    })

    test('book cannot be deleted without admin credentials', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToDelete = booksAtStart[0]
        const auth = await api.post('/api/login')
            .send(helper.user)
        await api
            .delete(`/api/books/${bookToDelete.id}`)
            .set('Authorization', `bearer ${auth.body.token}`)
            .expect(401)
        const booksAtEnd = await helper.booksInDatabase()
        expect(booksAtEnd).toHaveLength(booksAtStart.length)
        const titles = booksAtEnd.map(book => book.title)
        expect(titles).toContainEqual(bookToDelete.title)
    })

    test('book cannot be deleted without credentials', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToDelete = booksAtStart[0]
        await api
            .delete(`/api/books/${bookToDelete.id}`)
            .expect(401)
        const booksAtEnd = await helper.booksInDatabase()
        expect(booksAtEnd).toHaveLength(booksAtStart.length)
        const titles = booksAtEnd.map(book => book.title)
        expect(titles).toContainEqual(bookToDelete.title)
    })

    test('loan cannot be created without credentials', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToBorrow = booksAtStart[0]
        await api.post('/api/loans')
            .send({
                beginDate: '01/02/2020',
                endDate: '02/02/2020',
                customerId: 'katti',
                bookId: bookToBorrow.id,
                returned: false
            })
            .expect(401)
        const loansInDatabase = await helper.loansInDatabase()
        expect(loansInDatabase).toHaveLength(0)
    })

    test('book cannot be modified without credentials', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToModify = booksAtStart[0]
        await api.put(`/api/books/${bookToModify.id}`)
            .send({
                loan: { "$oid": "5eadf6fcd2f904085cbfc0ea" }
            })
            .expect(401)
        const booksAtEnd = await helper.booksInDatabase()
        expect(booksAtEnd[0]).toEqual(bookToModify)
    })

    test('customer cannot be created without credentials', async () => {
        await api.post('/api/customers')
            .send(helper.customer)
            .expect(401)
        const customersInDatabase = await helper.customersInDatabase()
        expect(customersInDatabase).toHaveLength(0)
    })

    test('customer cannot be modified without credentials', async () => {
        const auth = await api.post('/api/login')
            .send(helper.user)
        const customer = await api.post('/api/customers')
            .send(helper.customer)
            .set('Authorization', `bearer ${auth.body.token}`)
        await api.put(`/api/customers/${customer.id}`)
            .send({ accessAllowed: false })
            .expect(401)
        const customersInDatabase = await helper.customersInDatabase()
        expect(customersInDatabase).toHaveLength(1)
        const customerFinally = await helper.getCustomer()
        expect(customerFinally.accessAllowed).toBe(true)
    })

    test('book cannot be returned without credentials', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToBorrow = booksAtStart[0]
        const auth = await api.post('/api/login')
            .send(helper.user)
            .expect(200)
        const customer = await api.post('/api/customers')
            .send(helper.customer)
            .set('Authorization', `bearer ${auth.body.token}`)
            .expect(200)
        const loan = await api.post('/api/loans')
            .send({
                beginDate: '01/02/2020',
                endDate: '02/02/2020',
                customerId: customer.body.username,
                bookId: bookToBorrow.id,
                returned: false
            })
            .set('Authorization', `bearer ${auth.body.token}`)
            .expect(200)
        await api.put(`/api/loans/${loan.body.id}`)
            .send({
                endDate: '17/05/2020',
                returned: true
            })
            .expect(401)
        await api.put(`/api/books/${bookToBorrow}`)
            .send({ loan: null })
            .expect(401)
        const booksAtEnd = await helper.booksInDatabase()
        expect(booksAtEnd[0]).toEqual(bookToBorrow)
        const loansAtEnd = await helper.loansInDatabase()
        expect(loansAtEnd[0].returned).toBe(false)
    })
})

describe('database is empty at start', () => {
    beforeEach(async () => {
        await Book.deleteMany({})
    })

    test('a book cannot be added without credentials', async () => {
        const bookToAdd = {
            title: 'Testikirja',
            authors: ['Kaija Kirjailija'],
            languages: ['fi'],
            isbn: '0101010101010',
            copy: '1'
        }
        await api
            .post('/api/books', bookToAdd)
            .expect(401)
        const booksAtEnd = await helper.booksInDatabase()
        expect(booksAtEnd).toHaveLength(0)
    })
})

afterAll(() => {
    mongoose.connection.close()
})