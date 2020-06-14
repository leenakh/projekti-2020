import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCustomer } from '../reducers/customerReducer'
import { createLoan } from '../reducers/loansReducer'
import Confirmation from '../components/Confirmation'

export const BorrowingBookForm = ({ beginDate, setBeginDate, endDate, setEndDate }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const dispatch = useDispatch()
  const dateNow = new Date().toISOString().substring(0, 10)
  const handleDate = (selectedDate) => {
    const date = new Date(selectedDate).toISOString().substring(0, 10)
    setBeginDate(date)
    const end = new Date(date)
    end.setDate(end.getDate() + 28)
    const returnDate = end.toISOString().substring(0, 10)
    setEndDate(returnDate)
  }
  const customer = useSelector(state => state.customer)
  const books = useSelector(state => state.selectedBooks)
  const allBooks = useSelector(state => state.books)
  const book = useSelector(state => state.book)
  const beginDateParts = beginDate.split('-')
  const endDateParts = endDate.split('-')
  const beginDateString = `${beginDateParts[2]}.${beginDateParts[1]}.${beginDateParts[0]}`
  const endDateString = `${endDateParts[2]}.${endDateParts[1]}.${endDateParts[0]}`
  const Info = (
    <>
      <h3>Ole hyvä ja tarkista lainan tiedot.</h3>
      <table>
        <tbody>
          <tr><td>Nimeke:</td><td>{book.title}</td></tr>
          <tr><td>Nide:</td><td>nro {book.copy}</td></tr>
          <tr><td>Aika:</td><td>{beginDateString} - {endDateString}</td></tr>
          <tr><td>Asiakas:</td><td>{customer}</td></tr>
        </tbody>
      </table>
    </>
  )
  const borrowBook = () => {
    dispatch(createLoan(beginDate, endDate, customer, book.id, books, allBooks))
      .then(() => {
        dispatch(setCustomer(''))
        console.log('päivä')
      })
  }
  const handleBorrowingBook = async (event) => {
    event.preventDefault()
    setShowConfirm(true)
  }

  return (
    <>
      <form id="borrow" onSubmit={handleBorrowingBook}>
        <div>
          <p>Alkupäivä: <input type="date" value={beginDate} min={dateNow} required pattern="\d{4}-\d{2}-\d{2}" id="beginDate" onChange={({ target }) => handleDate(target.value)} /></p>
          <p>Loppupäivä: <input type="date" value={endDate} min={beginDate} id="endDate" onChange={({ target }) => setEndDate(target.value)} /></p>
          <p>Nimi: <input type="text" value={customer} id="customer" onChange={({ target }) => dispatch(setCustomer(target.value))} /></p>
        </div>
        <div>
          <button id="borrow-button" type="submit">Lainaa kirja</button>
        </div>
      </form>
      <div>
        {showConfirm !== false ? <Confirmation execute={borrowBook} setShowConfirm={setShowConfirm} info={Info} /> : null}
      </div>
    </>
  )
}

export default BorrowingBookForm