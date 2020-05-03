import React, { useState, useEffect } from 'react'
import './App.css';
import loginService from './services/login'
import bookService from './services/books'
import loanService from './services/loans'
import customerService from './services/customers'
import finnaService from './services/finna'
import Book from './components/Book'
import Books from './components/Books'

const App = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [book, setBook] = useState()
  const [books, setBooks] = useState([])
  const [selectedBooks, setSelectedBooks] = useState(null)
  const [bookTitles, setBookTitles] = useState(null)
  const [isbn, setIsbn] = useState('')
  const [title, setTitle] = useState('')
  const [selectedTitle, setSelectedTitle] = useState('')
  const [copy, setCopy] = useState('')
  const [beginDate, setBeginDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [customer, setCustomer] = useState('')
  const [loans, setLoans] = useState([])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      bookService.setToken(user.token)
      loanService.setToken(user.token)
      customerService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    try {
      window.localStorage.removeItem('loggedInUser')
      setUser(null)
    } catch (exception) {
      setErrorMessage('Could not log out')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      bookService.setToken(user.token)
      loanService.setToken(user.token)
      customerService.setToken(user.token)
    }
  }, [])

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

  const handleSelectBookFromListOfTitles = (booksTitle) => {
    try {
      setSelectedTitle(booksTitle)
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

  const showBookTitles = () => (
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

  const handleFetchBookByCopy = async (event) => {
    event.preventDefault()
    try {
      const selectedCopies = selectedBooks.filter(b => b.copy === copy)
      setBooks(selectedCopies)
      setCopy('')
    } catch (exception) {
      setErrorMessage('Nidettä ei löytynyt.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

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

  const handleGetBooksLoans = async (id) => {
    id = '5ea441ce119f2d3828edc9bb'
    try {
      const loans = await bookService.getLoans(id)
      setLoans(loans)
    } catch (exception) {
      setErrorMessage('Lainoja ei voitu hakea.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const showMessage = () => (
    <div>
      {message}
    </div>
  )

  const showError = () => (
    <div>
      {errorMessage}
    </div>
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username: <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password: <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  )

  const createBookForm = () => (
    <form onSubmit={handleCreateBook}>
      <div>
        isbn: <input type="text" value={isbn} name="isbn" onChange={({ target }) => setIsbn(target.value)} />
        copy: <input type="text" value={copy} name="copy" onChange={({ target }) => setCopy(target.value)} />
      </div>
      <div>
        <button type="submit">Lähetä</button>
      </div>
    </form>
  )

  const fetchBookByISBNForm = () => (
    <form onSubmit={handleFetchBookByISBN}>
      <div>
        ISBN: <input type="text" value={isbn} name="isbn" onChange={({ target }) => setIsbn(target.value)} />
      </div>
      <div>
        <button type="submit">Lähetä</button>
      </div>
    </form>
  )

  const fetchBookByTitleForm = () => (
    <form onSubmit={handleFetchBookByTitle}>
      <div>
        Title: <input type="text" value={title} name="title" onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        <button type="submit">Lähetä</button>
      </div>
    </form>
  )

  const fetchBookByCopyForm = () => (
    <form onSubmit={handleFetchBookByCopy}>
      <div>
        Copy: <input type="text" value={copy} name="copy" onChange={({ target }) => setCopy(target.value)} />
      </div>
      <div>
        <button type="submit">Lähetä</button>
      </div>
    </form>
  )

  const handleBorrowingBook = async (event) => {
    event.preventDefault()
    try {
      const requestedCustomer = await customerService.search(customer)
      console.log(requestedCustomer)
      if (requestedCustomer.length === 0) {
        const newCustomer = await customerService.create({
          username: customer
        })
        setCustomer(newCustomer.id)
        console.log(newCustomer)
      }
      const loan = {
        beginDate: beginDate,
        endDate: endDate,
        customerId: customer,
        bookId: book.id
      }
      console.log('loan', loan)
      const returnedLoan = await loanService.create(loan)
      console.log('reloan', returnedLoan)
      const returnedBook = await bookService.update(loan.bookId, { loanId: returnedLoan.id })
      setBook(returnedBook)
      setBooks(books.map(b => b.id !== returnedBook.id ? b : returnedBook))
      setBeginDate('')
      setEndDate('')
      setCustomer('')
      if (returnedBook.loan.id === returnedLoan.id) {
        console.log('returnedBook', returnedBook.loan.id)
        console.log('returnedLoan', returnedLoan.id)
        setMessage('Kirjan lainaaminen onnistui.')
        console.log(message)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    } catch (exception) {
      setErrorMessage('Kirjan lainaaminen ei onnistunut.')
      console.log(errorMessage)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleChooseBook = async (id) => {
    console.log(id)
    try {
      const chosenBook = books.find(book => book.id === id)
      setBook(chosenBook)
    } catch (exception) {
      console.log(exception)
      setErrorMessage('Kirjaa ei löytynyt.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const borrowingBookForm = () => (
    <form onSubmit={handleBorrowingBook}>
      <div>
        <p>Alkupäivä: <input type="text" value={beginDate} name="beginDate" onChange={({ target }) => setBeginDate(target.value)} /></p>
        <p>Loppupäivä: <input type="text" value={endDate} name="endDate" onChange={({ target }) => setEndDate(target.value)} /></p>
        <p>Nimi: <input type="text" value={customer} name="customer" onChange={({ target }) => setCustomer(target.value)} /></p>
      </div>
      <div>
        <button type="submit">Lainaa kirja</button>
      </div>
    </form>
  )

  const returnBook = () => (
    <button onClick={handleReturnBook}>Palauta kirja</button>
  )

  const handleReturnBook = async () => {
    try {
      const changedLoan = {
        endDate: '03/05/2020',
        returned: true
      }
      const returnedBook = await bookService.update(book.id, { loanId: null })
      console.log('returnedBook', returnedBook)
      const returnedLoan = await loanService.update(book.loan.id, changedLoan)
      setBook(returnedBook)
      setBooks(books.map(b => b.id !== returnedBook.id ? b : returnedBook))
      console.log('returnedLoan', returnedLoan)
    } catch (exception) {
      setErrorMessage('Kirjan palauttaminen ei onnistunut.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    console.log('book returned')
  }

  const showBooks = () => {
    return (
      <Books books={books} book={book} handleChooseBook={handleChooseBook} borrowingBookForm={borrowingBookForm} returnBook={returnBook} />
    )
  }

  const showLogout = () => (
    <p><button onClick={handleLogout}>Logout</button></p>
  )

  return (
    <>
      <div>
        {user === null ? loginForm() :
          <div>
            <p>{user.firstName} {user.lastName} on kirjautunut sisään.</p>
            {showLogout()}
          </div>}
      </div>
      <div>
        {fetchBookByISBNForm()}
        {fetchBookByTitleForm()}
        {selectedTitle === '' ? null : fetchBookByCopyForm()}
        {bookTitles === null ? showBooks() : showBookTitles()}
      </div>
      <div>
        {user !== null && user.username === 'admin' ? createBookForm() : null}
      </div>
      <div>
        {message === null ? null : showMessage()}
        {errorMessage === null ? null : showError()}
      </div>
    </>
  )
}

export default App
