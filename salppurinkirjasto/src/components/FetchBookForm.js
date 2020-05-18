import React from 'react'
import bookService from '../services/books'

export const fetchBookMessage = 'Kirjat löytyivät!'
export const fetchBookFailMessage = 'Kirjoja ei löytynyt.'

export const FetchBookForm = ({ title, setTitle, isbn, setIsbn, setSelectedBooks, setBookTitles, setBooks, setMessage, setErrorMessage }) => {
  const handleFetchBook = async (event) => {
    event.preventDefault()
    setSelectedBooks(null)
    let fetchedBooks = []
    try {
      console.log(title)
      const search = `title=${title}&isbn=${isbn}`
      console.log(search)
      fetchedBooks = await bookService.search(search)
      const uniqueBookTitles = [...new Set(fetchedBooks.map(b => b.title))]
      console.log(uniqueBookTitles)
      if (uniqueBookTitles.length > 0) {
        setBookTitles(uniqueBookTitles)
        setBooks(fetchedBooks)
        setTitle('')
        setIsbn('')
        setMessage(fetchBookMessage)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      } else {
        setErrorMessage(fetchBookFailMessage)
        setBookTitles([])
        setTitle('')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    } catch (exception) {
      console.log(exception)
    }
  }


  return (
    <form onSubmit={handleFetchBook}>
      <div>
        <h3>Hae kirja ISBN-tunnuksen tai otsikon perusteella</h3>
            ISBN: <input type="text" value={isbn} id="isbn" onChange={({ target }) => setIsbn(target.value)} />
            Title: <input type="text" value={title} id="title" onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        <button id="fetch" type="submit">Lähetä</button>
      </div>
    </form>
  )
}

export default
  {
    FetchBookForm,
    fetchBookMessage,
    fetchBookFailMessage
  }
