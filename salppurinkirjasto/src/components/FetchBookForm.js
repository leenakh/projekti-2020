import React from 'react'
import bookService from '../services/books'

const FetchBookForm = ({ title, setTitle, isbn, setIsbn, setSelectedBooks, setBookTitles, setBooks, setMessage, setErrorMessage }) => {
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
        setMessage('Kirjat löytyivät!')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setTitle('')
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
    <form onSubmit={handleFetchBook}>
      <div>
        <h3>Hae kirja ISBN-tunnuksen tai otsikon perusteella</h3>
            ISBN: <input type="text" value={isbn} name="isbn" onChange={({ target }) => setIsbn(target.value)} />
            Title: <input type="text" value={title} name="title" onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        <button type="submit">Lähetä</button>
      </div>
    </form>
  )
}

export default FetchBookForm