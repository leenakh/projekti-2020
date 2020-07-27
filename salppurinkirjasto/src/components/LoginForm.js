import React, { useState } from 'react'
import loginService from '../services/login'
import bookService from '../services/books'
import loanService from '../services/loans'
import customerService from '../services/customers'
import reservationService from '../services/reservations'
import calendarService from '../services/calendar'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { useDispatch } from 'react-redux'

export const loginError = 'Wrong credentials'

export const LoginForm = ({ setUser }) => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
      reservationService.setToken(user.token)
      calendarService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      dispatch(setErrorMessage(loginError))
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
  }
  return (
    <div className="login-form-container">
      <form onSubmit={handleLogin}>
        <table>
          <tbody>
            <tr><td className="login-form-cell">Käyttäjätunnus</td><td><input id="username" type="text" value={username} onChange={({ target }) => setUsername(target.value)} /></td></tr>
            <tr><td className="login-form-cell">Salasana</td><td><input id="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></td></tr>
          </tbody>
        </table>
        <div className="button-container">
          <button type="submit" className="login">Kirjaudu</button>
        </div>
      </form>
    </div>
  )
}

export default { LoginForm, loginError }