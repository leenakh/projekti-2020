import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { setBook } from '../reducers/bookReducer'
import { useDispatch, useSelector } from 'react-redux'


const ChooseBook = ({ book }) => {
    const books = useSelector(state => state.selectedBooks)
    const [showBorrow, setShowBorrow] = useState(true)
    const dispatch = useDispatch()
    const history = useHistory()
    const handleChooseBook = async (id) => {
        const chosenBook = books.find(b => b.id === id)
        setShowBorrow(!showBorrow)
        if (showBorrow) {
            dispatch(setBook(chosenBook))
            history.push(`/lainaa/${book.copy}`)
        } else if (!showBorrow) {
            dispatch(setBook(null))
            history.push('/lainaa')
        } 
    }
    return (
        <button className="choose-book" id="choose" onClick={() => handleChooseBook(book.id)}>{book.copy}</button>
    )
}

export default ChooseBook