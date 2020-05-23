import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import bookService from '../services/books'
import loanService from '../services/loans'
import { setBooks } from '../reducers/booksReducer'
import { setBook } from '../reducers/bookReducer'
import {setMessage} from '../reducers/messageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'

export const returningMessage = 'Kirjan palauttaminen onnistui.'
export const returningFailMessage = 'Kirjan palauttaminen ei onnistunut.'

export const ReturnBook = () => {
  const books = useSelector(state => state.books)
  const book = useSelector(state => state.book)
  const dispatch = useDispatch()
  const handleReturnBook = async () => {
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