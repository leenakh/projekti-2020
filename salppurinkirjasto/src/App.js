import React, { useState, useEffect } from 'react'
import Kissa from './components/Kissa'
import './App.css';
import kissaService from './services/kissat'
import loginService from './services/login'
import bookService from './services/books'
import loanService from './services/loans'
import customerService from './services/customers'
import finnaService from './services/finna'

const App = () => {

  const [kissa, setKissa] = useState({ id: 7, nimi: 'Kalle', ika: 0 })
  const [kissat, setKissat] = useState([])
  const [indeksi, setIndeksi] = useState(0)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [book, setBook] = useState()
  const [books, setBooks] = useState([])
  const [isbn, setIsbn] = useState('')
  const [title, setTitle] = useState('')
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

      kissaService.setToken(user.token)
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
    console.log('effect')
    kissaService.getAll()
      .then(response => {
        setKissat(response)
        console.log(kissat)
      })
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      kissaService.setToken(user.token)
      bookService.setToken(user.token)
      loanService.setToken(user.token)
      customerService.setToken(user.token)
    }
  }, [])

  const addKissa = () => {
    //event.preventDefault()
    const uusiKissa = {
      nimi: 'Pekka Töpöhäntä',
      ika: 6
    }
    kissaService
      .create(uusiKissa)
      .then(response => {
        console.log(response)
        setKissat(kissat.concat(response))
        setKissa(response)
      })
      .catch(error => {
        console.log('Ei onnistunut :)')
      })
  }

  const muutaKissanIka = id => {
    const muutettavaKissa = kissa
    id = muutettavaKissa.id
    console.log('muutettavan kissan id', id)
    const muutettuKissa = { ...muutettavaKissa, ika: 1 }
    kissaService
      .update(muutettavaKissa.id, muutettuKissa)
      .then(response => {
        setKissat(kissat.map(kissa => kissa.id !== muutettavaKissa.id ? kissa : response))
        setKissa(muutettuKissa)
      })
      .catch(error => {
        console.log('Ei onnistunut :(')
      })
  }

  const getVille = id => {
    kissaService
      .getOne(id)
      .then(response => {
        setKissa(response)
      })
      .catch(error => {
        console.log('Ei onnistunut :)')
      })
  }

  const poistaKissa = id => {
    id = kissa.id
    console.log('poistettava id', id)
    kissaService
      .remove(id)
      .then(response => {
        setKissat(kissat.filter(k => k.id !== id))
        setKissa(kissat[indeksi])
      })
  }

  const handle = () => {
    let uusiIndeksi = 0
    let uusikissa = kissat[indeksi]
    setKissa(uusikissa)
    if (indeksi < kissat.length - 1) {
      uusiIndeksi = indeksi + 1
    }
    setIndeksi(uusiIndeksi)
    console.log('uusikissa', uusikissa)
  }

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

  const handleFetchBookByTitle = async (event) => {
    event.preventDefault()
    try {
      console.log(title)
      const fetchedBooks = await bookService.searchTitle(title)
      if (fetchedBooks.length > 0) {
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
        Alkupäivä: <input type="text" value={beginDate} name="beginDate" onChange={({ target }) => setBeginDate(target.value)} />
        Loppupäivä: <input type="text" value={endDate} name="endDate" onChange={({ target }) => setEndDate(target.value)} />
        Nimi: <input type="text" value={customer} name="customer" onChange={({ target }) => setCustomer(target.value)} />
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
      const changedBook = {
        loan: null
      }
      const changedLoan = {
        endDate: '03/05/2020',
        returned: true
      }
      const returnedBook = await bookService.update(book.id, { book, loanId: null })
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
      <>
        <div>
          Kirjat
        <ul>
            {books.map(b =>
              <li key={b.id}>
                {b.title}
                <p><button onClick={() => handleChooseBook(b.id)}>{b.copy}</button></p>
                <div>
                  {book && !b.loan && book.id === b.id ? borrowingBookForm() : null}
                  {book && b.loan && book.id === b.id ? returnBook() : null}
                </div>
              </li>)}
          </ul>
        </div>

      </>
    )
  }

  const kissanapit = () => (
    <div >
      <p><button onClick={handleBorrowingBook}>Lainaa kirja</button></p>
      <p><button onClick={handleGetBooksLoans}>Lainat</button></p>
      <p><button onClick={handleLogout}>Logout</button></p>
      <button onClick={handle}>Napsauta!</button>
      <button onClick={addKissa}>Lisää kissa!</button>
      <button onClick={() => muutaKissanIka(kissa.id)}>Kissanpentu!</button>
      <button onClick={() => getVille('5e9b1c9f62614f36a401935e')}>Ville!</button>
      <button onClick={poistaKissa}>Poista kissa!</button>
      <Kissa nimi={kissa.nimi} ika={kissa.ika} />
    </div>
  )

  return (
    <>
      <div>
        {user === null ? loginForm() :
          <div>
            <p>{user.firstName} {user.lastName} on kirjautunut sisään.</p>
            {kissanapit()}
          </div>}
      </div>
      <div>
        {fetchBookByISBNForm()}
        {fetchBookByTitleForm()}
        {showBooks()}
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
