import React from 'react'
import { useHistory } from 'react-router-dom'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { useDispatch } from 'react-redux'
import loanService from '../services/loans'
import bookService from '../services/books'
import customerService from '../services/customers'
import reservationService from '../services/reservations'
import calendarService from '../services/calendar'

const Logout = ({ setUser }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedInUser')
      bookService.setToken('')
      loanService.setToken('')
      customerService.setToken('')
      reservationService.setToken('')
      calendarService.setToken('')
      setUser(null)
      history.push('/')
    } catch (exception) {
      dispatch(setErrorMessage('Could not log out'))
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
  }

  return (
    <p><button className="logout" onClick={handleLogout}>Poistu</button></p>
  )
}

export default Logout