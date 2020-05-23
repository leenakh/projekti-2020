import React from 'react'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { useDispatch } from 'react-redux'

const Logout = ({ setUser }) => {
  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedInUser')
      setUser(null)
    } catch (exception) {
      dispatch(setErrorMessage('Could not log out'))
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
  }

  return (
    <p><button id="logout" onClick={handleLogout}>Logout</button></p>
  )
}

export default Logout