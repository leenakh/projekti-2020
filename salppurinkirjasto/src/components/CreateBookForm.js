import React from 'react'
import finnaService from '../services/finna'
import bookService from '../services/books'
import { useDispatch, useSelector } from 'react-redux'
import { createBook } from '../reducers/booksReducer'
import { setIsbn } from '../reducers/isbnReducer'
import {setCopy} from '../reducers/copyReducer'
import {setMessage} from '../reducers/messageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'

const CreateBookForm = () => {
  const message = useSelector(state => state.message)
  const errorMessage = useSelector(state => state.errorMessage)
  const dispatch = useDispatch()
  const isbn = useSelector(state => state.isbn)
  const copy = useSelector(state => state.copy)
  const handleCreateBook = async (event) => {
    event.preventDefault()
    try {
      const result = await finnaService.getOne(isbn)
      const bookInfo = result.records[0]
      const newBook = {
        title: bookInfo.title,
        authors: bookInfo.nonPresenterAuthors,
        languages: bookInfo.languages,
        isbn: isbn,
        copy: copy
      }
      const returnedBook = await bookService.create(newBook)
      if (returnedBook) {
        await dispatch(setMessage('Uuden kirjan lisääminen onnistui!'))
        dispatch(setIsbn(''))
        dispatch(setCopy(''))
        dispatch(createBook(returnedBook))
        console.log(message)
        setTimeout(() => {
          dispatch(setMessage(null))
        }, 5000)
        console.log(message)
      }
      console.log(returnedBook)
    } catch (exception) {
      dispatch(setErrorMessage('Uuden kirjan luominen ei onnistunut!'))
      console.log(errorMessage)
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
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