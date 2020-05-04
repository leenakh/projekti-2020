import React from 'react'
import finnaService from '../services/finna'
import bookService from '../services/books'

const CreateBookForm = ({ isbn, setIsbn, copy, setCopy, message, setMessage, errorMessage, setErrorMessage }) => {
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
        setIsbn('')
        setCopy('')
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
    <form onSubmit={handleCreateBook}>
      <div>
        <h3>Lisää uusi kirja tietokantaan</h3>
        isbn: <input type="text" value={isbn} name="isbn" onChange={({ target }) => setIsbn(target.value)} />
        copy: <input type="text" value={copy} name="copy" onChange={({ target }) => setCopy(target.value)} />
      </div>
      <div>
        <button type="submit">Lähetä</button>
      </div>
    </form>
  )

}

export default CreateBookForm