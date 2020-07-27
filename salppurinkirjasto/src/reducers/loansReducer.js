import loanService from '../services/loans'
import bookService from '../services/books'
import customerService from '../services/customers'
import { setBook } from '../reducers/bookReducer'
import { setCustomer } from '../reducers/customerReducer'
import { setCustomers } from '../reducers/customerInfoReducer'
import { setMessage } from '../reducers/messageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setBooks } from '../reducers/booksReducer'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'

export const failMessage = 'Kirjan lainaaminen ei onnistunut.'
export const returningMessage = 'Kirjan palauttaminen onnistui.'
export const returningFailMessage = 'Kirjan palauttaminen ei onnistunut.'

export const loansReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_LOAN':
            return action.data
        case 'CUSTOMERS_LOANS':
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

export const createLoan = (beginDate, endDate, customer, customers, bookId, books, allBooks) => {
    return async dispatch => {
        try {
            const requestedCustomer = await customerService.search(customer)
            dispatch(setCustomer(customer))
            if (requestedCustomer.length === 0) {
                const newCustomer = await customerService.create({
                    username: customer
                })
                const changedCustomers = [...customers, newCustomer]
                dispatch(setCustomers(changedCustomers))
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
            if (!returnedBook.loan) {
                await loanService.remove(returnedLoan.id)
                dispatch({
                    type: 'SET_LOAN',
                    data: null
                })
                dispatch(setErrorMessage(failMessage))
                setTimeout(() => {
                    dispatch(setErrorMessage(''))
                }, 3000)
                dispatch(setBook(null))
            }
            const filteredBooks = books.map(b => b.id !== returnedBook.id ? b : returnedBook)
            dispatch(setSelectedBooks(filteredBooks))
            const filteredAllBooks = allBooks.map(b => b.id !== returnedBook.id ? b : returnedBook)
            dispatch(setBooks(filteredAllBooks))
        } catch {
            dispatch(setErrorMessage(failMessage))
            setTimeout(() => {
                dispatch(setErrorMessage(null))
            }, 3000)
        }
    }
}

export const returnLoan = (book, books, allBooks) => {
    return async dispatch => {
        try {
            const date = new Date().toISOString().substring(0, 10)
            const changedLoan = {
                endDate: date,
                returned: true
            }
            const returnedBook = await bookService.update(book.id, { loanId: null })
            const returnedLoan = await loanService.update(book.loan.id, changedLoan)
            dispatch(setBook(returnedBook))
            dispatch(setSelectedBooks(books.map(b => b.id !== returnedBook.id ? b : returnedBook)))
            const filteredAllBooks = allBooks.map(b => b.id !== returnedBook.id ? b : returnedBook)
            dispatch(setBooks(filteredAllBooks))
            dispatch({
                type: 'SET_LOAN',
                data: returnedLoan
            })
            dispatch(setMessage(returningMessage))
            setTimeout(() => {
                dispatch(setMessage(null))
            }, 3000)
        } catch (exception) {
            dispatch(setErrorMessage(returningFailMessage))
            setTimeout(() => {
                dispatch(setErrorMessage(null))
            }, 3000)
        }
    }
}

export const getCustomersLoans = (customer) => {
    return async dispatch => {
        try {
            const loans = await customerService.getLoans(customer)
            dispatch({
                type: 'CUSTOMERS_LOANS',
                data: loans
            })
        } catch (exception) {
            console.log('Asiakkaan lainojen hakeminen ei onnistunut.')
        }
    }
}

export default loansReducer