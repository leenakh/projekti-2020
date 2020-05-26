import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBook } from '../reducers/booksReducer'
import { setIsbn } from '../reducers/isbnReducer'
import { setCopy } from '../reducers/copyReducer'

const CreateBookForm = () => {
  const dispatch = useDispatch()
  const isbn = useSelector(state => state.isbn)
  const copy = useSelector(state => state.copy)
  const handleCreateBook = async (event) => {
    event.preventDefault()
    dispatch(createBook(isbn, copy))
    dispatch(setIsbn(''))
    dispatch(setCopy(''))
  }

  return (
    <form id="createBook" onSubmit={handleCreateBook}>
      <div>
        <h3>Lisää uusi kirja tietokantaan</h3>
        isbn: <input type="text" value={isbn} id="isbn" onChange={({ target }) => dispatch(setIsbn(target.value))} />
        copy: <input type="text" value={copy} id="copy" onChange={({ target }) => dispatch(setCopy(target.value))} />
      </div>
      <div>
        <button id="create-button" type="submit">Lähetä</button>
      </div>
    </form>
  )

}

export default CreateBookForm