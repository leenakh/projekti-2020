import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setBooks } from '../reducers/booksReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import { setBookTitles } from '../reducers/bookTitlesReducer'

const SelectTitle = () => {
  const bookTitles = useSelector(state => state.bookTitles)
  const books = useSelector(state => state.books)
  const history = useHistory()
  const dispatch = useDispatch()
  const handleSelectBookFromListOfTitles = (booksTitle) => {
    try {
      const booksForSelection = books.filter(b => b.title === booksTitle)
      dispatch(setBooks(booksForSelection))
      dispatch(setSelectedBooks(booksForSelection))
      //dispatch(setBookTitles(null))
      history.push("/lainaa")
    } catch (exception) {
      dispatch(setErrorMessage('Kirjoja ei löytynyt.'))
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
  }
  const handleReserve = (booksTitle) => {
    const booksForSelection = books.filter(b => b.title === booksTitle)
      dispatch(setSelectedBooks(booksForSelection))
      history.push("/varaus")
  }

  return (
    <div>
      <ul>
        {bookTitles.map(title =>
          <li key={title}>
            {title}
            <p><button onClick={() => handleSelectBookFromListOfTitles(title)}>Lainaa/palauta</button>
            <button onClick={() => handleReserve(title)}>Varaa</button></p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SelectTitle