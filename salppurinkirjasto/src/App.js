import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
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
  const bookTitles = useSelector(state => state.bookTitles)
  const selectedBooks = useSelector(state => state.selectedBooks)
  const [user, setUser] = useState(null)
  const [beginDate, setBeginDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
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
    <LoginForm setUser={setUser} />
  )

  const showLogout = () => (
    <Logout setUser={setUser} />
  )

  const createBookForm = () => (
    <CreateBookForm />
  )

  const fetchBookForm = () => (
    <FetchBookForm />
  )

  const fetchBookByCopyForm = () => (
    <FetchBookByCopyForm />
  )

  const borrowingBookForm = () => (
    <BorrowingBookForm beginDate={beginDate} setBeginDate={setBeginDate} endDate={endDate} setEndDate={setEndDate} />
  )

  const showBooks = () => {
    return (
      <Books borrowingBookForm={borrowingBookForm} />
    )
  }

  const showBookTitles = () => (
    <SelectTitle />
  )

  const showMessage = () => (
    <Message />
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
