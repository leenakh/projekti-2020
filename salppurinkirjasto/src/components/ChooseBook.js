import React from 'react'
import { useHistory } from 'react-router-dom'
import { setBook } from '../reducers/bookReducer'
import { useDispatch, useSelector } from 'react-redux'


const ChooseBook = ({ book }) => {
    const books = useSelector(state => state.selectedBooks)
    const dispatch = useDispatch()
    const history = useHistory()
    const handleChooseBook = async (id) => {
        const chosenBook = books.find(b => b.id === id)
        dispatch(setBook(chosenBook))
        history.push(`/lainaa/${book.copy}`)
    }
    return (
        <button id="choose" onClick={() => handleChooseBook(book.id)}>{book.copy}</button>
    )
}

export default ChooseBook