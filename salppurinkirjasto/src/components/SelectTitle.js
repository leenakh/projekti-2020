import React from 'react'
import { useDispatch } from 'react-redux'
import { setBooks } from '../reducers/bookReducer'

const SelectTitle = ({ books, setSelectedBooks, setTitle, bookTitles, setBookTitles, setErrorMessage }) => {
  const dispatch = useDispatch()
  const handleSelectBookFromListOfTitles = (booksTitle) => {
    try {
      const booksForSelection = books.filter(b => b.title === booksTitle)
      dispatch(setBooks(booksForSelection))
      setSelectedBooks(booksForSelection)
      setTitle('')
      setBookTitles(null)
    } catch (exception) {
      setErrorMessage('Kirjoja ei löytynyt.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <ul>
        {bookTitles.map(title =>
          <li key={title}>
            {title}
            <p><button onClick={() => handleSelectBookFromListOfTitles(title)}>Valitse</button></p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SelectTitle