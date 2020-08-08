import React from 'react'
import { useHistory } from 'react-router-dom'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { useDispatch } from 'react-redux'
import loanService from '../services/loans'
import bookService from '../services/books'
import customerService from '../services/customers'
import reservationService from '../services/reservations'
import calendarService from '../services/calendar'
import { setBook } from '../reducers/bookReducer'
import { setBooks } from '../reducers/booksReducer'
import { setBookTitles } from '../reducers/bookTitlesReducer'
import { setCopy } from '../reducers/copyReducer'
import { setIsbn } from '../reducers/isbnReducer'
import { setCustomers } from '../reducers/customerInfoReducer'
import { setCustomer } from '../reducers/customerReducer'
import { setLoan } from '../reducers/loansReducer'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import { setTitle } from '../reducers/titleReducer'

const Logout = ({ setUser }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const resetState = () => {
    dispatch(setBook(null))
    dispatch(setBooks([]))
    dispatch(setBookTitles(null))
    dispatch(setCopy(''))
    dispatch(setIsbn(''))
    dispatch(setCustomers([]))
    dispatch(setCustomer(''))
    dispatch(setLoan(null))
    dispatch(setSelectedBooks(null))
    dispatch(setTitle(''))
  }

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedInUser')
      bookService.setToken('')
      loanService.setToken('')
      customerService.setToken('')
      reservationService.setToken('')
      calendarService.setToken('')
      setUser(null)
      resetState()
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