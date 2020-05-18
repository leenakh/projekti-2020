import React from 'react'
import customerService from '../services/customers'
import loanService from '../services/loans'
import bookService from '../services/books'

export const borrowingMessage = 'Kirjan lainaaminen onnistui.'
export const failMessage = 'Kirjan lainaaminen ei onnistunut.'

export const BorrowingBookForm = ({ book, setBook, books, setBooks, beginDate, setBeginDate, endDate, setEndDate, customer, setCustomer, message, setMessage, errorMessage, setErrorMessage }) => {
  const handleBorrowingBook = async (event) => {
    event.preventDefault()
    try {
      const requestedCustomer = await customerService.search(customer)
      console.log(requestedCustomer)
      if (requestedCustomer.length === 0) {
        const newCustomer = await customerService.create({
          username: customer
        })
        setCustomer(newCustomer.id)
        console.log(newCustomer)
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
      setBook(returnedBook)
      setBooks(books.map(b => b.id !== returnedBook.id ? b : returnedBook))
      setBeginDate('')
      setEndDate('')
      setCustomer('')
      if (returnedBook.loan.id === returnedLoan.id) {
        console.log('returnedBook', returnedBook.loan.id)
        console.log('returnedLoan', returnedLoan.id)
        setMessage(borrowingMessage)
        console.log(message)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    } catch (exception) {
      setErrorMessage(failMessage)
      console.log(errorMessage)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <form id="borrow" onSubmit={handleBorrowingBook}>
      <div>
        <p>Alkupäivä: <input type="text" value={beginDate} id="beginDate" onChange={({ target }) => setBeginDate(target.value)} /></p>
        <p>Loppupäivä: <input type="text" value={endDate} id="endDate" onChange={({ target }) => setEndDate(target.value)} /></p>
        <p>Nimi: <input type="text" value={customer} id="customer" onChange={({ target }) => setCustomer(target.value)} /></p>
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