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
    <form onSubmit={handleFetchBook}>
      <div>
        <h3>Hae kirja ISBN-tunnuksen tai otsikon perusteella</h3>
            ISBN: <input type="text" value={isbn} id="isbn" onChange={({ target }) => dispatch(setIsbn(target.value))} />
            Title: <input type="text" value={title} id="title" onChange={({ target }) => dispatch(setTitle(target.value))} />
      </div>
      <div>
        <button id="fetch" type="submit">Lähetä</button>
      </div>
    </form>
  )
}

export default FetchBookForm
