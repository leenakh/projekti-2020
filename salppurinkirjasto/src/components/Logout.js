import React from 'react'

const Logout = ({setUser, setErrorMessage}) => {
    const handleLogout = async () => {
        try {
          window.localStorage.removeItem('loggedInUser')
          setUser(null)
        } catch (exception) {
          setErrorMessage('Could not log out')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
      }
    
    return (
    <p><button id="logout" onClick={handleLogout}>Logout</button></p>
  )}

  export default Logout