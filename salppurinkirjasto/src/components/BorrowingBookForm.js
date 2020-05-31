import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCustomer } from '../reducers/customerReducer'
import { createLoan } from '../reducers/loansReducer'

export const BorrowingBookForm = ({ beginDate, setBeginDate, endDate, setEndDate }) => {
  const dispatch = useDispatch()
  const customer = useSelector(state => state.customer)
  const books = useSelector(state => state.books)
  const book = useSelector(state => state.book)
  const handleBorrowingBook = async (event) => {
    event.preventDefault()
    dispatch(createLoan(beginDate, endDate, customer, book.id, books))
      .then(() => {
        setBeginDate('')
        setEndDate('')
        dispatch(setCustomer(''))
      })
  }

  return (
    <form id="borrow" onSubmit={handleBorrowingBook}>
      <div>
        <p>Alkupäivä: <input type="text" value={beginDate} id="beginDate" onChange={({ target }) => setBeginDate(target.value)} /></p>
        <p>Loppupäivä: <input type="text" value={endDate} id="endDate" onChange={({ target }) => setEndDate(target.value)} /></p>
        <p>Nimi: <input type="text" value={customer} id="customer" onChange={({ target }) => dispatch(setCustomer(target.value))} /></p>
      </div>
      <div>
        <button id="borrow-button" type="submit">Lainaa kirja</button>
      </div>
    </form>
  )
}

export default BorrowingBookForm