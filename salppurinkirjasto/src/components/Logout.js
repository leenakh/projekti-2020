import React from 'react'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { useDispatch } from 'react-redux'
import loanService from '../services/loans'
import bookService from '../services/books'
import customerService from '../services/customers'
import reservationService from '../services/reservations'
import calendarService from '../services/calendar'

const Logout = ({ setUser }) => {
  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedInUser')
      bookService.setToken('')
      loanService.setToken('')
      customerService.setToken('')
      reservationService.setToken('')
      calendarService.setToken('')
      setUser(null)
    } catch (exception) {
      dispatch(setErrorMessage('Could not log out'))
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
  }

  return (
    <p><button id="logout" onClick={handleLogout}>Kirjaudu ulos</button></p>
  )
}

export default Logout