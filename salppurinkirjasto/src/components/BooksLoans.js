import React, { useState } from 'react'
import bookService from '../services/books'

const BooksLoans = ({ book, setErrorMessage }) => {
  const [loans, setLoans] = useState([])
  const handleGetBooksLoans = async (id) => {
    try {
      const loans = await bookService.getLoans(book.id)
      setLoans(loans)
    } catch (exception) {
      setErrorMessage('Lainoja ei voitu hakea.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  return (
    null
  )
}

export default BooksLoans
