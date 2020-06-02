import loanService from '../services/loans'
import bookService from '../services/books'
import customerService from '../services/customers'
import { setBook } from '../reducers/bookReducer'
import { setCustomer } from '../reducers/customerReducer'
import { setMessage } from '../reducers/messageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setBooks } from '../reducers/booksReducer'

export const failMessage = 'Kirjan lainaaminen ei onnistunut.'
export const returningMessage = 'Kirjan palauttaminen onnistui.'
export const returningFailMessage = 'Kirjan palauttaminen ei onnistunut.'

export const loansReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_LOAN':
            return action.data
        default:
            return state
    }
}

export const setLoan = (loan) => {
    return {
        type: 'SET_LOAN',
        data: loan
    }
}

export const createLoan = (beginDate, endDate, customer, bookId, books) => {
    return async dispatch => {
        try {
            const requestedCustomer = await customerService.search(customer)
            console.log('requested customer', requestedCustomer)
            dispatch(setCustomer(customer))
            if (requestedCustomer.length === 0) {
                const newCustomer = await customerService.create({
                    username: customer
                })
                console.log('newCustomer', newCustomer)
            }
            const loan = {
                beginDate: beginDate,
                endDate: endDate,
                customerId: customer,
                bookId: bookId
            }
            const returnedLoan = await loanService.create(loan)
            console.log('reloan', returnedLoan)
            dispatch({
                type: 'SET_LOAN',
                data: returnedLoan
            })
            const returnedBook = await bookService.update(bookId, { loanId: returnedLoan.id })
            dispatch(setBook(returnedBook))
            const filteredBooks = books.map(b => b.id !== returnedBook.id ? b : returnedBook)
            dispatch(setBooks(filteredBooks))
        } catch {
            dispatch(setErrorMessage(failMessage))
            setTimeout(() => {
                dispatch(setErrorMessage(null))
            }, 5000)
        }
    }
}

export const returnLoan = (book, books) => {
    return async dispatch => {
        try {
            const changedLoan = {
                endDate: '03/05/2020',
                returned: true
            }
            const returnedBook = await bookService.update(book.id, { loanId: null })
            console.log('returnedBook', returnedBook)
            const returnedLoan = await loanService.update(book.loan.id, changedLoan)
            dispatch(setBook(returnedBook))
            dispatch(setBooks(books.map(b => b.id !== returnedBook.id ? b : returnedBook)))
            console.log('returnedLoan', returnedLoan)
            dispatch({
                type: 'SET_LOAN',
                data: returnedLoan
            })
            dispatch(setMessage(returningMessage))
            setTimeout(() => {
                dispatch(setMessage(null))
            }, 5000)
        } catch (exception) {
            dispatch(setErrorMessage(returningFailMessage))
            setTimeout(() => {
                dispatch(setErrorMessage(null))
            }, 5000)
        }
    }
}

export default loansReducer