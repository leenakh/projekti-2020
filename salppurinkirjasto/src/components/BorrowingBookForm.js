import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCustomer } from '../reducers/customerReducer'
import { createLoan } from '../reducers/loansReducer'

export const BorrowingBookForm = ({ beginDate, setBeginDate, endDate, setEndDate }) => {
  const dispatch = useDispatch()
  const date = new Date().toISOString().substring(0, 10)
  const customer = useSelector(state => state.customer)
  const books = useSelector(state => state.books)
  const book = useSelector(state => state.book)
  const handleBorrowingBook = async (event) => {
    event.preventDefault()
    setBeginDate(date)
    dispatch(createLoan(beginDate, endDate, customer, book.id, books))
      .then(() => {
        setEndDate('')
        dispatch(setCustomer(''))
        console.log('päivä', beginDate)
      })
  }

  return (
    <form id="borrow" onSubmit={handleBorrowingBook}>
      <div>
        <p>Alkupäivä: <input type="date" value={beginDate} min={date} id="beginDate" onChange={({ target }) => setBeginDate(target.value)} /></p>
        <p>Loppupäivä: <input type="date" value={endDate} id="endDate" onChange={({ target }) => setEndDate(target.value)} /></p>
        <p>Nimi: <input type="text" value={customer} id="customer" onChange={({ target }) => dispatch(setCustomer(target.value))} /></p>
      </div>
      <div>
        <button id="borrow-button" type="submit">Lainaa kirja</button>
      </div>
    </form>
  )
}

export default BorrowingBookForm