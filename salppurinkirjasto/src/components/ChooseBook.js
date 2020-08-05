import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { setBook } from '../reducers/bookReducer'
import { useDispatch, useSelector } from 'react-redux'


const ChooseBook = ({ book, showInfo, setShowInfo }) => {
  const books = useSelector(state => state.selectedBooks)
  const [showBorrow, setShowBorrow] = useState(true)
  const dispatch = useDispatch()
  const history = useHistory()
  const handleChooseBook = async (id) => {
    const chosenBook = books.find(b => b.id === id)
    setShowBorrow(!showBorrow)
    setShowInfo(!showInfo)
    if (showBorrow) {
      dispatch(setBook(chosenBook))
      //history.push(`/lainaa/${book.copy}`)
    } else if (!showBorrow) {
      dispatch(setBook(null))
      history.push('/lainaa')
    }
  }
  return (
    <button className="title" id="choose" onClick={() => handleChooseBook(book.id)}>{book.title}</button>
  )
}

export default ChooseBook