import React from 'react'

const SelectTitle = ({ books, setBooks, setSelectedBooks, setTitle, bookTitles, setBookTitles, setErrorMessage }) => {
  const handleSelectBookFromListOfTitles = (booksTitle) => {
    try {
      const booksForSelection = books.filter(b => b.title === booksTitle)
      setBooks(booksForSelection)
      setSelectedBooks(booksForSelection)
      setTitle('')
      setBookTitles(null)
    } catch (exception) {
      setErrorMessage('Kirjoja ei löytynyt.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <ul>
        {bookTitles.map(title =>
          <li key={title}>
            {title}
            <p><button onClick={() => handleSelectBookFromListOfTitles(title)}>Valitse</button></p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SelectTitle