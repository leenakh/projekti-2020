import React from 'react'
import bookService from '../services/books'
import loanService from '../services/loans'

export const returningMessage = 'Kirjan palauttaminen onnistui.'
export const returningFailMessage = 'Kirjan palauttaminen ei onnistunut.'

export const ReturnBook = ({ book, setBook, books, setBooks, setMessage, setErrorMessage }) => {
  const handleReturnBook = async () => {
    try {
      const changedLoan = {
        endDate: '03/05/2020',
        returned: true
      }
      const returnedBook = await bookService.update(book.id, { loanId: null })
      console.log('returnedBook', returnedBook)
      const returnedLoan = await loanService.update(book.loan.id, changedLoan)
      setBook(returnedBook)
      setBooks(books.map(b => b.id !== returnedBook.id ? b : returnedBook))
      console.log('returnedLoan', returnedLoan)
      setMessage(returningMessage)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(returningFailMessage)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    console.log('book returned')
  }

  return (
    <button id="return-button" onClick={handleReturnBook}>Palauta kirja</button>
  )
}

export default
  {
    ReturnBook,
    returningMessage,
    returningFailMessage
  }