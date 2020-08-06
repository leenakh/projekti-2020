import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBook } from '../reducers/booksReducer'
import { setIsbn } from '../reducers/isbnReducer'
import { setCopy } from '../reducers/copyReducer'
import { BookInfo } from '../components/SelectTitle'
import { setBook } from '../reducers/bookReducer'

const CreateBookForm = () => {
  const dispatch = useDispatch()
  const isbn = useSelector(state => state.isbn)
  const copy = useSelector(state => state.copy)
  const [year, setYear] = useState('')
  const book = useSelector(state => state.book)

  useEffect(() => {
    dispatch(setBook(null))
  }, [])

  const handleCreateBook = async (event) => {
    event.preventDefault()
    dispatch(createBook(isbn, copy, year))
    dispatch(setIsbn(''))
    dispatch(setCopy(''))
  }

  return (
    <div>
      <div className="create-book-form-container">
        <form id="createBook" onSubmit={handleCreateBook}>
          <div>
            <h3>Lisää uusi kirja tietokantaan</h3>
            <table>
              <tbody>
                <tr><td className="create-book-cell">ISBN</td><td><input type="text" value={isbn} id="isbn" onChange={({ target }) => dispatch(setIsbn(target.value))} /></td></tr>
                <tr><td className="create-book-cell">Julkaisuvuosi</td><td><input type="text" value={year} id="year" onChange={({ target }) => setYear(target.value)} /></td></tr>
                <tr><td className="create-book-cell">Niteen numero</td><td><input type="text" value={copy} id="copy" onChange={({ target }) => dispatch(setCopy(target.value))} /></td></tr>
              </tbody>
            </table>
          </div>
          <div className="button-container">
            <button className="create-button" type="submit">Lisää</button>
          </div>
        </form>
      </div>
      {book ? <div className="created-book-container"><BookInfo bookTitle={book.title} isbn={isbn} /></div> : null}
    </div>
  )

}

export default CreateBookForm