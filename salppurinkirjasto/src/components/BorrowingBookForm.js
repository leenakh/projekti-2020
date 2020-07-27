import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCustomer } from '../reducers/customerReducer'
import { createLoan } from '../reducers/loansReducer'
import Confirmation from '../components/Confirmation'
import Info from '../components/Info'
import { dateFormat } from '../components/DateFormat'

export const BorrowingBookForm = ({ beginDate, setBeginDate, endDate, setEndDate }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showLoanInfo, setShowLoanInfo] = useState(false)
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
  const customers = useSelector(state => state.customerInfo)
  const books = useSelector(state => state.selectedBooks)
  const allBooks = useSelector(state => state.books)
  const book = useSelector(state => state.book)

  const showInfo = (information) => {
    const title = { propertyName: `Nimeke`, propertyValue: `${information[0]}` }
    const copy = { propertyName: `Nide`, propertyValue: `${information[1]}` }
    const begin = { propertyName: 'Alkaa', propertyValue: `${dateFormat(information[2])}` }
    const end = { propertyName: 'Päättyy', propertyValue: `${dateFormat(information[3])}` }
    const customer = { propertyName: 'Asiakas', propertyValue: `${information[4]}` }
    return [title, copy, begin, end, customer]
  }

  const borrowBook = () => {
    setShowLoanInfo(false)
    dispatch(createLoan(beginDate, endDate, customer, customers, book.id, books, allBooks))
      .then(() => {
        dispatch(setCustomer(''))
      })
  }

  const handleBorrowingBook = async (event) => {
    event.preventDefault()
    setShowConfirm(true)
    setShowLoanInfo(true)
  }

  return (
    <div className="borrow-form-container">
      <form id="borrow" onSubmit={handleBorrowingBook}>
        <table>
          <tbody>
            <tr><td className="borrow-form-cell">Alkaa</td><td><input type="date" value={beginDate} min={dateNow} required pattern="\d{4}-\d{2}-\d{2}" id="beginDate" onChange={({ target }) => handleDate(target.value)} /></td></tr>
            <tr><td className="borrow-form-cell">Päättyy</td><td><input type="date" value={endDate} min={beginDate} id="endDate" onChange={({ target }) => setEndDate(target.value)} /></td></tr>
            <tr><td className="borrow-form-cell">Asiakas</td><td><input type="text" value={customer} className="customer" onChange={({ target }) => dispatch(setCustomer(target.value))} /></td></tr>
          </tbody>
        </table>
        <div className="button-container">
          {showConfirm ? <Confirmation execute={borrowBook} setShowConfirm={setShowConfirm} setShowInfo={setShowLoanInfo} /> :
            <button className="borrow-button" type="submit">Lainaa</button>}
        </div>
      </form>
    </div>
  )
}

export default BorrowingBookForm