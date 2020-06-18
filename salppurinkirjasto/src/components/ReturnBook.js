import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { returnLoan } from '../reducers/loansReducer'
import Confirmation from '../components/Confirmation'

export const ReturnBook = () => {
  const books = useSelector(state => state.selectedBooks)
  const allBooks = useSelector(state => state.books)
  const book = useSelector(state => state.book)
  const [showConfirm, setShowConfirm] = useState(false)
  const dispatch = useDispatch()

  const returnBook = () => {
    setShowConfirm(false)
    dispatch(returnLoan(book, books, allBooks))
  }

  const handleReturnBook = async () => {
    setShowConfirm(true)
  }

  const Info = () => {
    if (book.loan) {
      return (
        <div>
          <h3>Ole hyvä ja tarkista palautuksen tiedot.</h3>
          <table>
            <tbody>
              <tr><td>Nimeke:</td><td>{book.title}</td></tr>
              <tr><td>Nide:</td><td>nro {book.copy}</td></tr>
              <tr><td>Asiakas:</td><td>{book.loan.customer}</td></tr>
            </tbody>
          </table>
        </div>
      )
    }
  }

  return (
    <>
      <button id="return-button" onClick={handleReturnBook}>Palauta kirja</button>
      <div>
        {showConfirm !== false ? <Confirmation execute={returnBook} setShowConfirm={setShowConfirm} info={Info()} /> : null}
      </div>
    </>
  )
}

export default ReturnBook