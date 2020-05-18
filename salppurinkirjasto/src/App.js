import React, { useState, useEffect } from 'react'
import './App.css'
import bookService from './services/books'
import loanService from './services/loans'
import customerService from './services/customers'
import Books from './components/Books'
import CreateBookForm from './components/CreateBookForm'
import { FetchBookForm } from './components/FetchBookForm'
import FetchBookByCopyForm from './components/FetchBookByCopyForm'
import { LoginForm } from './components/LoginForm'
import Logout from './components/Logout'
import { BorrowingBookForm } from './components/BorrowingBookForm'
import SelectTitle from './components/SelectTitle'
import Message from './components/Message'

const App = () => {

  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [book, setBook] = useState()
  const [books, setBooks] = useState([])
  const [selectedBooks, setSelectedBooks] = useState(null)
  const [bookTitles, setBookTitles] = useState(null)
  const [isbn, setIsbn] = useState('')
  const [title, setTitle] = useState('')
  const [copy, setCopy] = useState('')
  const [beginDate, setBeginDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [customer, setCustomer] = useState('')

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

  const loginForm = () => (
    <LoginForm setUser={setUser} setErrorMessage={setErrorMessage} />
  )

  const showLogout = () => (
    <Logout setUser={setUser} setErrorMessage={setErrorMessage} />
  )

  const createBookForm = () => (
    <CreateBookForm isbn={isbn} setIsbn={setIsbn} copy={copy} setCopy={setCopy} message={message} setMessage={setMessage} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
  )

  const fetchBookForm = () => (
    <FetchBookForm title={title} isbn={isbn} setTitle={setTitle} setIsbn={setIsbn} setSelectedBooks={setSelectedBooks} setBookTitles={setBookTitles} setBooks={setBooks} setMessage={setMessage} setErrorMessage={setErrorMessage} />
  )

  const fetchBookByCopyForm = () => (
    <FetchBookByCopyForm setBooks={setBooks} selectedBooks={selectedBooks} copy={copy} setCopy={setCopy} setErrorMessage={setErrorMessage} />
  )

  const borrowingBookForm = () => (
    <BorrowingBookForm book={book} setBook={setBook} books={books} setBooks={setBooks} beginDate={beginDate} setBeginDate={setBeginDate} endDate={endDate} setEndDate={setEndDate} customer={customer} setCustomer={setCustomer} message={message} setMessage={setMessage} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
  )

  const showBooks = () => {
    return (
      <Books books={books} setBooks={setBooks} book={book} setBook={setBook} borrowingBookForm={borrowingBookForm} setMessage={setMessage} setErrorMessage={setErrorMessage} />
    )
  }

  const showBookTitles = () => (
    <SelectTitle books={books} setBooks={setBooks} setSelectedBooks={setSelectedBooks} setTitle={setTitle} bookTitles={bookTitles} setBookTitles={setBookTitles} setErrorMessage={setErrorMessage} />
  )

  const showMessage = () => (
    <Message message={message} errorMessage={errorMessage} />
  )

  const loginMessage = () => (
    <p>{user.firstName} {user.lastName} on kirjautunut sisään.</p>
  )

  return (
    <>
      <div>
        {user === null ? loginForm() :
          <div>
            {loginMessage()}
            {showLogout()}
          </div>}
      </div>
      <div>
        {user !== null && user.username === 'admin' ? createBookForm() : null}
      </div>
      <div>
        {user === null ? null : fetchBookForm()}
        {selectedBooks === null ? null : fetchBookByCopyForm()}
        {bookTitles === null ? showBooks() : showBookTitles()}
      </div>
      <div>
        {showMessage()}
      </div>
    </>
  )
}

export default App
