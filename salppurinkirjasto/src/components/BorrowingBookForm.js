import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCustomer } from '../reducers/customerReducer'
import { createLoan } from '../reducers/loansReducer'
import Confirmation from '../components/Confirmation'

export const BorrowingBookForm = ({ beginDate, setBeginDate, endDate, setEndDate }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const dispatch = useDispatch()
  const date = new Date().toISOString().substring(0, 10)
  const end = new Date()
  end.setDate(end.getDate() + 28)
  const returnDate = end.toISOString().substring(0, 10)
  const customer = useSelector(state => state.customer)
  const books = useSelector(state => state.selectedBooks)
  const allBooks = useSelector(state => state.books)
  const book = useSelector(state => state.book)
  const borrowBook = () => {
    setBeginDate(date)
      setEndDate(returnDate)
      dispatch(createLoan(beginDate, endDate, customer, book.id, books, allBooks))
        .then(() => {
          dispatch(setCustomer(''))
          console.log('päivä')
        })
  }
  const handleBorrowingBook = async (event) => {
    event.preventDefault()
    //kysy käyttäjältä, haluaako varmasti lainata
    setShowConfirm(true)
    //console.log('confirm', confirm)
    /* if (confirm) {
      setBeginDate(date)
      setEndDate(returnDate)
      dispatch(createLoan(beginDate, endDate, customer, book.id, books, allBooks))
        .then(() => {
          dispatch(setCustomer(''))
          console.log('päivä')
        })
    } */
  }

  return (
    <>
      <form id="borrow" onSubmit={handleBorrowingBook}>
        <div>
          <p>Alkupäivä: <input type="date" value={beginDate} min={date} required pattern="\d{4}-\d{2}-\d{2}" id="beginDate" onChange={({ target }) => setBeginDate(target.value)} /></p>
          <p>Loppupäivä: <input type="date" value={endDate} min={date} id="endDate" onChange={({ target }) => setEndDate(target.value)} /></p>
          <p>Nimi: <input type="text" value={customer} id="customer" onChange={({ target }) => dispatch(setCustomer(target.value))} /></p>
        </div>
        <div>
          <button id="borrow-button" type="submit">Lainaa kirja</button>
        </div>
      </form>
      <div>
        {showConfirm !== false ? <Confirmation execute={borrowBook} /> : null}
      </div>
    </>
  )
}

export default BorrowingBookForm