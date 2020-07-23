import React, { useState } from 'react'
import bookService from '../services/books'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { useDispatch, useSelector } from 'react-redux'

const BooksLoans = () => {
  const book = useSelector(state => state.book)
  const dispatch = useDispatch()
  const [loans, setLoans] = useState([])
  const handleGetBooksLoans = async () => {
    try {
      const loans = await bookService.getLoans(book.id)
      setLoans(loans)
    } catch (exception) {
      dispatch(setErrorMessage('Lainoja ei voitu hakea.'))
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
  }
  return (
    <button onClick={() => handleGetBooksLoans()}>{loans}</button>
  )
}

export default BooksLoans
