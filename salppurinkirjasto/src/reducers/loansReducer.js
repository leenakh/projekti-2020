import loanService from '../services/loans'
import bookService from '../services/books'
import customerService from '../services/customers'
import { setBook } from '../reducers/bookReducer'
import { setCustomer } from '../reducers/customerReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setBooks } from '../reducers/booksReducer'

export const failMessage = 'Kirjan lainaaminen ei onnistunut.'

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

export default loansReducer