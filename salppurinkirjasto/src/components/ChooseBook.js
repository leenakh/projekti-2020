import React from 'react'
import { setBook } from '../reducers/bookReducer'
import { useDispatch, useSelector } from 'react-redux'

const ChooseBook = ({ book }) => {
    const books = useSelector(state => state.books)
    const dispatch = useDispatch()
    const handleChooseBook = async (id) => {
        const chosenBook = books.find(b => b.id === id)
        dispatch(setBook(chosenBook))
    }
    return (
        <button id="choose" onClick={() => handleChooseBook(book.id)}>{book.copy}</button>
    )
}

export default ChooseBook