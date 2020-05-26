import finnaService from '../services/finna'
import bookService from '../services/books'
import { setErrorMessage } from '../reducers/errorMessageReducer'

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

export const createBook = (isbn, copy) => {
    return async dispatch => {
        try {
            const result = await finnaService.getOne(isbn)
            const bookInfo = result.records[0]
            const newBook = {
                title: bookInfo.title,
                authors: bookInfo.nonPresenterAuthors,
                languages: bookInfo.languages,
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

export const setBooks = (books) => {
    return {
        type: 'SET_BOOKS',
        data: books
    }
}

export default booksReducer