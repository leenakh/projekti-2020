import React from 'react'
import finnaService from '../services/finna'
import bookService from '../services/books'
import { useDispatch, useSelector } from 'react-redux'
import { createBook } from '../reducers/bookReducer'
import { setIsbn } from '../reducers/isbnReducer'
import {setCopy} from '../reducers/copyReducer'

const CreateBookForm = ({ isbn, copy, message, setMessage, errorMessage, setErrorMessage }) => {
  const dispatch = useDispatch()
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
        await setMessage('Uuden kirjan lisääminen onnistui!')
        //setIsbn('')
        dispatch(setIsbn(''))
        //setCopy('')
        dispatch(setCopy(''))
        dispatch(createBook(returnedBook))
        console.log(message)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        console.log(message)
      }
      console.log(returnedBook)
    } catch (exception) {
      await setErrorMessage('Uuden kirjan luominen ei onnistunut!')
      console.log(errorMessage)
      setTimeout(() => {
        setErrorMessage(null)
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