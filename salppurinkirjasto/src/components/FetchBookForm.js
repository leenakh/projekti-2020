import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setTitle } from '../reducers/titleReducer'
import { setIsbn } from '../reducers/isbnReducer'
import { fetchBook } from '../reducers/booksReducer'

export const FetchBookForm = () => {
  const isbn = useSelector(state => state.isbn)
  const title = useSelector(state => state.title)
  const dispatch = useDispatch()
  const history = useHistory()
  const handleFetchBook = async (event) => {
    event.preventDefault()
    dispatch(fetchBook(title, isbn))
    history.push(`/kirjat/${title}&${isbn}`)
  }

  return (
    <div className="fetch-book-container">
      <form className="fetch-book-form" onSubmit={handleFetchBook}>
        <table>
          <tbody>
            <tr><td className="fetch-form-cell">ISBN-tunnus</td><td><input type="text" value={isbn} id="isbn" onChange={({ target }) => dispatch(setIsbn(target.value))} /></td></tr>
            <tr><td className="fetch-form-cell">Nimeke</td><td><input type="text" value={title} id="title" onChange={({ target }) => dispatch(setTitle(target.value))} /></td></tr>
          </tbody>
        </table>
        <div className="button-container">
          <button className="fetch-book" type="submit">Hae</button>
        </div>
      </form>
    </div>
  )
}

export default FetchBookForm
