import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { returnLoan } from '../reducers/loansReducer'
import Confirmation from '../components/Confirmation'
import Info from '../components/Info'

export const ReturnBook = ({ book }) => {
  const books = useSelector(state => state.selectedBooks)
  const allBooks = useSelector(state => state.books)
  //const book = useSelector(state => state.book)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showReturnInfo, setShowReturnInfo] = useState(false)
  const dispatch = useDispatch()

  const returnBook = () => {
    setShowConfirm(false)
    setShowReturnInfo(false)
    dispatch(returnLoan(book, books, allBooks))
  }

  const handleReturnBook = async () => {
    setShowConfirm(true)
    setShowReturnInfo(true)
  }

  const showInfo = (information) => {
    const title = { propertyName: `Nimeke`, propertyValue: `${information[0]}` }
    const copy = { propertyName: `Nide`, propertyValue: `${information[1]}` }
    const customer = { propertyName: 'Asiakas', propertyValue: `${information[2]}` }
    return [title, copy, customer]
  }

  return (
    <div className="return-container">
      {!showConfirm ? <button className="return-button" onClick={handleReturnBook}>Palauta</button> : null}
      <div>
        {showConfirm !== false ? <><div>Haluatko palauttaa tämän lainan?</div><Confirmation execute={returnBook} setShowConfirm={setShowConfirm} setShowInfo={setShowReturnInfo} /></> : null}
      </div>
    </div>
  )
}

export default ReturnBook