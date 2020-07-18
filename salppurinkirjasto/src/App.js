import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'
import bookService from './services/books'
import loanService from './services/loans'
import customerService from './services/customers'
import reservationService from './services/reservations'
import calendarService from './services/calendar'
import Books from './components/Books'
import CreateBookForm from './components/CreateBookForm'
import { FetchBookForm } from './components/FetchBookForm'
import FetchBookByCopyForm from './components/FetchBookByCopyForm'
import { LoginForm } from './components/LoginForm'
import Logout from './components/Logout'
import { BorrowingBookForm } from './components/BorrowingBookForm'
import SelectTitle from './components/SelectTitle'
import Message from './components/Message'
import Reservation from './components/Reservation'
import UserInfo from './components/UserInfo'
import Calendar from './components/Calendar'
import Customer from './components/Customer'

const App = () => {
  const date = new Date().toISOString().substring(0, 10)
  const end = new Date()
  end.setDate(end.getDate() + 28)
  const returnDate = end.toISOString().substring(0, 10)
  const bookTitles = useSelector(state => state.bookTitles)
  const selectedBooks = useSelector(state => state.selectedBooks)
  const customer = useSelector(state => state.customer)
  const [user, setUser] = useState(null)
  const [beginDate, setBeginDate] = useState(date)
  const [endDate, setEndDate] = useState(returnDate)
  const [reservations, setReservations] = useState([])
  const [calendarEntries, setCalendarEntries] = useState([])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      bookService.setToken(user.token)
      loanService.setToken(user.token)
      customerService.setToken(user.token)
      reservationService.setToken(user.token)
      calendarService.setToken(user.token)
    }
  }, [])

  const borrowingBookForm = () => (
    <BorrowingBookForm beginDate={beginDate} setBeginDate={setBeginDate} endDate={endDate} setEndDate={setEndDate} />
  )

  const loginMessage = () => (
    <div>{user.firstName} {user.lastName}</div>
  )

  const reservation = () => (
    <Reservation beginDate={beginDate} setBeginDate={setBeginDate} endDate={endDate} setEndDate={setEndDate} reservations={reservations} setReservations={setReservations} />
  )

  const style = {
    padding: 5
  }

  return (
    <Router>
      <div className="nav responsive">
        <div className="dropdown">

          <button className="dropdown-button">
            <i className="fa fa-caret-down"></i>
          </button>


          <div className="dropdown-menu" >
            <Link className="dropdown-item" to="/">Etusivu</Link>
            <Link className="dropdown-item" to="/kirjat">Kirjasto</Link>
            {user !== null && user.username === 'admin' ? <Link className="dropdown-item" to="/kirjastonhoitaja">Kirjastonhoitaja</Link> : null}
            {user !== null ? <Link className="dropdown-item" to={`/manage/${user.username}`}>Omat tiedot</Link> : null}
            <Link className="dropdown-item" to="/asiakas">Asiakas</Link>
          </div>
        </div>
        <div className="logged-in-user">
          {user !== null ? <div>
            {loginMessage()}
            <Logout setUser={setUser} />
          </div> : null
          }
        </div>
      </div>
      {user === null ? <LoginForm setUser={setUser} /> : null}
      <Switch>
        <Route path="/kirjat/:tunniste">
          <div>
            {bookTitles === null ? <Books borrowingBookForm={borrowingBookForm} /> : <SelectTitle />}
          </div>
        </Route>
        <Route path="/kirjat">
          <div>
            {user === null ? null : <FetchBookForm />}
            {bookTitles === null ? null : <SelectTitle />}
          </div>
        </Route>
        <Route path="/kirjastonhoitaja">
          {user !== null && user.username === 'admin' ? <CreateBookForm /> : null}
        </Route>
        <Route path="/lainaa">
          <div>
            <Books borrowingBookForm={borrowingBookForm} />
          </div>
        </Route>
        <Route path="/lainaa/:copy">
          <div>
            <Books borrowingBookForm={borrowingBookForm} />
          </div>
        </Route>
        <Route path="/varaus">
          {user !== null && bookTitles !== null ? reservation() : null}
          {selectedBooks !== [] && selectedBooks !== null ? <Calendar setBeginDate={setBeginDate} setEndDate={setEndDate} reservations={reservations} /> : null}
        </Route>
        <Route path="/asiakas">
          <div>
            <Customer />
          </div>
        </Route>
        <Route path="/manage/:username">
          <div>
            {user !== null ? <UserInfo user={user} borrowingBookForm={borrowingBookForm} setBeginDate={setBeginDate} setEndDate={setEndDate} /> : null}
          </div>
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
