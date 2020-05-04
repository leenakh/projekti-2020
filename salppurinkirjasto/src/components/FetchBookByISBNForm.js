import React from 'react'
import bookService from '../services/books'

const FetchBookByISBNForm = ({isbn, setIsbn, setBooks, setMessage, setErrorMessage }) => {
  const handleFetchBookByISBN = async (event) => {
    event.preventDefault()
    try {
      const fetchedBooks = await bookService.searchISBN(isbn)
      if (fetchedBooks.length > 0) {
        setBooks(fetchedBooks)
        setMessage('Kirjat löytyivät!')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setIsbn('')
      } else {
        setErrorMessage('Kirjoja ei löytynyt!')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <form onSubmit={handleFetchBookByISBN}>
      <div>
          <h3>Hae kirja ISBN-tunnuksella</h3>
        ISBN: <input type="text" value={isbn} name="isbn" onChange={({ target }) => setIsbn(target.value)} />
      </div>
      <div>
        <button type="submit">Lähetä</button>
      </div>
    </form>
  )}

  export default FetchBookByISBNForm