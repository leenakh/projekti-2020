import React from 'react'
import bookService from '../services/books'
import loanService from '../services/loans'

const ReturnBook = ({book, setBook, books, setBooks, setErrorMessage}) => {
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
        } catch (exception) {
          setErrorMessage('Kirjan palauttaminen ei onnistunut.')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
        console.log('book returned')
      }

    return (
    <button onClick={handleReturnBook}>Palauta kirja</button>
  )}

  export default ReturnBook