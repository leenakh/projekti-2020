import React, { useState } from 'react'
import loginService from '../services/login'
import bookService from '../services/books'
import loanService from '../services/loans'
import customerService from '../services/customers'

const LoginForm = ({ setUser, setErrorMessage }) => {
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
    return (
    <form onSubmit={handleLogin}>
        <div><h3>Kirjaudu sisään</h3></div>
        <div>
            username: <input id="username" type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
            password: <input id="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <div>
            <button type="submit" id='login'>Login</button>
        </div>
    </form>
)}

export default LoginForm