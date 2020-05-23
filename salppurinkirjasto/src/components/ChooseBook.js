import React from 'react'
import { setBook } from '../reducers/bookReducer'
import { useDispatch, useSelector } from 'react-redux'
import { setErrorMessage } from '../reducers/errorMessageReducer'

const ChooseBook = ({ book }) => {
    const books = useSelector(state => state.books)
    const dispatch = useDispatch()
    const handleChooseBook = async (id) => {
        console.log(id)
        try {
            const chosenBook = books.find(b => b.id === id)
            dispatch(setBook(chosenBook))
        } catch (exception) {
            console.log(exception)
            dispatch(setErrorMessage('Kirjaa ei löytynyt.'))
            setTimeout(() => {
                dispatch(setErrorMessage(null))
            }, 5000)
        }
    }
    return (
        <button id="choose" onClick={() => handleChooseBook(book.id)}>{book.copy}</button>
    )
}

export default ChooseBook
