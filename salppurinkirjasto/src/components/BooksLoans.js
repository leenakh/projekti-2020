import React, { useState, useEffect } from 'react'
import bookService from '../services/books'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { useDispatch, useSelector } from 'react-redux'
import { dateFormat } from '../components/DateFormat'
import Info from '../components/Info'

const BooksLoans = () => {
  const book = useSelector(state => state.book)
  const dispatch = useDispatch()
  const [loans, setLoans] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  const [showInfoText, setShowInfoText] = useState('Näytä lainat')

  useEffect(() => {
    handleGetBooksLoans()
  }, [])

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

  const toggleInfo = () => {
    setShowInfo(!showInfo)
    const text = showInfo ? 'Näytä lainat' : 'Piilota lainat'
    setShowInfoText(text)
  }

  const loanInfo = (loan) => {
    const customer = { propertyName: 'Asiakas', propertyValue: `${loan.customer}` }
    const beginDate = { propertyName: 'Alkaa', propertyValue: `${dateFormat(loan.beginDate)}` }
    const endDate = { propertyName: 'Päättyy', propertyValue: `${dateFormat(loan.endDate)}` }
    const loanReturned = loan.returned ? 'Kyllä' : 'Ei'
    const returned = { propertyName: 'Palautettu', propertyValue: `${loanReturned}` }
    return [customer, beginDate, endDate, returned]
  }

  return (
    <div className="books-loans-container">
      <div className="button-container"><button className="books-loans-button" onClick={toggleInfo}>{showInfoText}</button></div>
      {showInfo && loans ?
        <div className="books-loan-container">
          {loans.map(l =>
            <div key={l.id} className="books-loan-info">
              <Info information={loanInfo(l)} />
            </div>
          )}
        </div> : null}
    </div>
  )
}

export default BooksLoans
