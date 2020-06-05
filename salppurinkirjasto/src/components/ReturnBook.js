import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {returnLoan} from '../reducers/loansReducer'

export const ReturnBook = () => {
  const books = useSelector(state => state.selectedBooks)
  const allBooks = useSelector(state => state.books)
  const book = useSelector(state => state.book)
  const dispatch = useDispatch()
  const handleReturnBook = async () => {
    dispatch(returnLoan(book, books, allBooks))
  }
  return (
    <button id="return-button" onClick={handleReturnBook}>Palauta kirja</button>
  )
}

export default ReturnBook