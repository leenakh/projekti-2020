const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Book = require('../models/book')

describe('some books initially in the database', () => {
    beforeEach(async () => {
        await Book.deleteMany({})
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

    test('a book can be deleted', async () => {
        const booksAtStart = await helper.booksInDatabase()
        const bookToDelete = booksAtStart[0]
        await api
            .delete(`/api/books/${bookToDelete.id}`)
            .expect(204)
        const booksAtEnd = await helper.booksInDatabase()
        expect(booksAtEnd).toHaveLength(booksAtStart.length - 1)
        const titles = booksAtEnd.map(book => book.title)
        expect(titles).not.toContainEqual(bookToDelete.title)
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