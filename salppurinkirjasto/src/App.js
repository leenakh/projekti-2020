import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './App.css'
import bookService from './services/books'
import loanService from './services/loans'
import customerService from './services/customers'
import reservationService from './services/reservations'
import calendarService from './services/calendar'
import Books from './components/Books'
import CreateBookForm from './components/CreateBookForm'
import { FetchBookForm } from './components/FetchBookForm'
import { LoginForm } from './components/LoginForm'
import Logout from './components/Logout'
import { BorrowingBookForm } from './components/BorrowingBookForm'
import SelectTitle from './components/SelectTitle'
import Message from './components/Message'
import Reservation from './components/Reservation'
import UserInfo from './components/UserInfo'
import Calendar from './components/Calendar'
import Customer from './components/Customer'
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { getCustomers } from './reducers/customerInfoReducer'

const App = () => {
  const dispatch = useDispatch()
  const date = new Date().toISOString().substring(0, 10)
  const end = new Date()
  end.setDate(end.getDate() + 28)
  const returnDate = end.toISOString().substring(0, 10)
  const bookTitles = useSelector(state => state.bookTitles)
  const selectedBooks = useSelector(state => state.selectedBooks)
  const [user, setUser] = useState(null)
  const [beginDate, setBeginDate] = useState(date)
  const [endDate, setEndDate] = useState(returnDate)
  const [reservations, setReservations] = useState([])

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

  useEffect(() => {
    dispatch(getCustomers())
  }, [dispatch])

  const borrowingBookForm = () => (
    <BorrowingBookForm beginDate={beginDate} setBeginDate={setBeginDate} endDate={endDate} setEndDate={setEndDate} />
  )

  const loginMessage = () => (
    <div>{user.firstName} {user.lastName}</div>
  )

  const reservation = () => (
    <Reservation beginDate={beginDate} setBeginDate={setBeginDate} endDate={endDate} setEndDate={setEndDate} reservations={reservations} setReservations={setReservations} />
  )

  return (

    <Router>

      <div className="nav responsive">
      <div className="logged-in-user">
          {user !== null ? <div>
            {loginMessage()}
            <Logout setUser={setUser} />
          </div> : null
          }
        </div>
        <div className="dropdown">
          <button className="dropdown-button">
            <MenuIcon fontSize="large" />
          </button>
          <div className="dropdown-menu" >
            <Link className="dropdown-item" to="/">Etusivu</Link>
            <Link className="dropdown-item" to="/kirjat">Kirjasto</Link>
            <Link className="dropdown-item" to="/asiakas">Asiakas</Link>
            {user !== null ? <Link className="dropdown-item" to={`/hallitse/${user.username}`}>Omat tiedot</Link> : null}
            {user !== null && user.username === 'admin' ? <Link className="dropdown-item" to="/kirjastonhoitaja">Kirjastonhoitaja</Link> : null}
          </div>
        </div>
      </div>
      {user === null ? <LoginForm setUser={setUser} /> : null}

      <div>
        <Message />
      </div>

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

        <Route path="/asiakas/:id">
          {user !== null ? <Customer /> : null}
        </Route>

        <Route path="/asiakas">
          {user !== null ? <Customer /> : null}
        </Route>

        <Route path="/hallitse/:username">
          <div>
            {user !== null ? <UserInfo user={user} borrowingBookForm={borrowingBookForm} setBeginDate={setBeginDate} setEndDate={setEndDate} /> : null}
          </div>
        </Route>

        <Route path="/">
        </Route>

      </Switch>

    </Router>
  )
}

export default App
