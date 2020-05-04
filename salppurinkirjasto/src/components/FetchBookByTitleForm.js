import React from 'react'
import bookService from '../services/books'

const FetchBookByTitleForm = ({ title, setTitle, setBookTitles, setBooks, setMessage, setErrorMessage }) => {
    const handleFetchBookByTitle = async (event) => {
        event.preventDefault()
        let fetchedBooks = []
        try {
          console.log(title)
          fetchedBooks = await bookService.searchTitle(title)
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
    <form onSubmit={handleFetchBookByTitle}>
        <div>
            <h3>Hae kirja otsikon perusteella</h3>
            Title: <input type="text" value={title} name="title" onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
            <button type="submit">Lähetä</button>
        </div>
    </form>
)}

export default FetchBookByTitleForm