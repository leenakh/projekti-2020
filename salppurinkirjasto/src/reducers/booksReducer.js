import finnaService from '../services/finna'
import bookService from '../services/books'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setBookTitles } from '../reducers/bookTitlesReducer'
import { setSelectedBooks } from './selectedBooksReducer'

export const fetchBookMessage = 'Kirjat löytyivät!'
export const fetchBookFailMessage = 'Kirjoja ei löytynyt.'

export const booksReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_BOOKS':
            return action.data
        case 'NEW_BOOK':
            return [...state, action.data]
        default:
            return state
    }
}

export const setBooks = (books) => {
    return {
        type: 'SET_BOOKS',
        data: books
    }
}

export const createBook = (isbn, copy, year) => {
    return async dispatch => {
        try {
            const result = await finnaService.getOne(isbn)
            const bookInfo = result.records[0]
            const newBook = {
                title: bookInfo.title,
                authors: bookInfo.nonPresenterAuthors,
                languages: bookInfo.languages,
                published: year,
                isbn: isbn,
                copy: copy
            }
            const returnedBook = await bookService.create(newBook)
            dispatch({
                type: 'NEW_BOOK',
                data: returnedBook
            })
        } catch (exception) {
            dispatch(setErrorMessage('Uuden kirjan luominen ei onnistunut!'))
            setTimeout(() => {
                dispatch(setErrorMessage(null))
            }, 5000)
        }
    }
}

export const fetchBook = (title, isbn) => {
    let fetchedBooks = []
    return async dispatch => {
        try {
            const search = `title=${title}&isbn=${isbn}`
            fetchedBooks = await bookService.search(search)
            const uniqueBookTitles = [...new Set(fetchedBooks.map(b => b.title))]
            if (uniqueBookTitles.length > 0) {
                dispatch(setBookTitles(uniqueBookTitles))
                dispatch(setBooks(fetchedBooks))
                dispatch(setSelectedBooks(fetchedBooks))
            } else {
                dispatch(setBookTitles([]))
                setTimeout(() => {
                    dispatch(setErrorMessage(null))
                }, 5000)
            }
        } catch (exception) {

        }
    }
}

export default booksReducer