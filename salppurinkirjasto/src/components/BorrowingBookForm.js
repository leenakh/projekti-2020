import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import customerService from '../services/customers'
import loanService from '../services/loans'
import bookService from '../services/books'
import { setBooks } from '../reducers/booksReducer'
import { setBook } from '../reducers/bookReducer'
import { setMessage } from '../reducers/messageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setCustomer } from '../reducers/customerReducer'

export const borrowingMessage = 'Kirjan lainaaminen onnistui.'
export const failMessage = 'Kirjan lainaaminen ei onnistunut.'

export const BorrowingBookForm = ({ beginDate, setBeginDate, endDate, setEndDate }) => {
  const customer = useSelector(state => state.customer)
  const message = useSelector(state => state.message)
  const errorMessage = useSelector(state => state.errorMessage)
  const books = useSelector(state => state.books)
  const book = useSelector(state => state.book)
  const dispatch = useDispatch()
  const handleBorrowingBook = async (event) => {
    event.preventDefault()
    try {
      const requestedCustomer = await customerService.search(customer)
      console.log(requestedCustomer)
      if (requestedCustomer.length === 0) {
        const newCustomer = await customerService.create({
          username: customer
        })
        dispatch(setCustomer(customer))
        console.log('new customer', newCustomer)
      }
      const loan = {
        beginDate: beginDate,
        endDate: endDate,
        customerId: customer,
        bookId: book.id
      }
      console.log('loan', loan)
      const returnedLoan = await loanService.create(loan)
      console.log('reloan', returnedLoan)
      const returnedBook = await bookService.update(loan.bookId, { loanId: returnedLoan.id })
      dispatch(setBook(returnedBook))
      dispatch(setBooks(books.map(b => b.id !== returnedBook.id ? b : returnedBook)))
      setBeginDate('')
      setEndDate('')
      dispatch(setCustomer(''))
      if (returnedBook.loan.id === returnedLoan.id) {
        console.log('returnedBook', returnedBook.loan.id)
        console.log('returnedLoan', returnedLoan.id)
        dispatch(setMessage(borrowingMessage))
        console.log(message)
        setTimeout(() => {
          dispatch(setMessage(null))
        }, 5000)
      }
    } catch (exception) {
      dispatch(setErrorMessage(failMessage))
      console.log(errorMessage)
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
  }

  return (
    <form id="borrow" onSubmit={handleBorrowingBook}>
      <div>
        <p>Alkupäivä: <input type="text" value={beginDate} id="beginDate" onChange={({ target }) => setBeginDate(target.value)} /></p>
        <p>Loppupäivä: <input type="text" value={endDate} id="endDate" onChange={({ target }) => setEndDate(target.value)} /></p>
        <p>Nimi: <input type="text" value={customer} id="customer" onChange={({ target }) => dispatch(setCustomer(target.value))} /></p>
      </div>
      <div>
        <button id="borrow-button" type="submit">Lainaa kirja</button>
      </div>
    </form>
  )
}

export default {
  BorrowingBookForm,
  borrowingMessage,
  failMessage
}