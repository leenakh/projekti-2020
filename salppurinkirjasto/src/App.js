import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
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
  const date = new Date().toISOString().substring(0, 10)
  const bookTitles = useSelector(state => state.bookTitles)
  const selectedBooks = useSelector(state => state.selectedBooks)
  const [user, setUser] = useState(null)
  const [beginDate, setBeginDate] = useState(date)
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

  const borrowingBookForm = () => (
    <BorrowingBookForm beginDate={beginDate} setBeginDate={setBeginDate} endDate={endDate} setEndDate={setEndDate} />
  )

  const loginMessage = () => (
    <p>{user.firstName} {user.lastName} on kirjautunut sisään.</p>
  )

  const style = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={style} to="/">Etusivu</Link>
        <Link style={style} to="/kirjat">Kirjasto</Link>
        <Link style={style} to="/pusu">Pusu</Link>
      </div>
      <div>
        {user !== null ? <div>
          {loginMessage()}
          <Logout setUser={setUser} />
        </div> : <LoginForm setUser={setUser} />
        }
      </div>
      <Switch>
        <Route path="/kirjat">
          <div>
            {user === null ? null : <FetchBookForm />}
            {selectedBooks === null ? null : <FetchBookByCopyForm />}
            {bookTitles === null ? <Books borrowingBookForm={borrowingBookForm} /> : <SelectTitle />}
          </div>
        </Route>
        <Route path="/pusu">
          {user !== null && user.username === 'admin' ? <CreateBookForm /> : null}
        </Route>
        <Route path="/">
        </Route>
      </Switch>
      <div>
        <Message />
      </div>
    </Router>
  )
}

export default App
