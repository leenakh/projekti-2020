import React, { useState, useEffect } from 'react'
import Kissa from './components/Kissa'
import './App.css';
import kissaService from './services/kissat'
import loginService from './services/login'
import bookService from './services/books'
import finnaService from './services/finna'

const App = () => {

  const [kissa, setKissa] = useState({ id: 7, nimi: 'Kalle', ika: 0 })
  const [kissat, setKissat] = useState([])
  const [indeksi, setIndeksi] = useState(0)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [book, setBook] = useState()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedInUser', JSON.stringify(user))

      kissaService.setToken(user.token)
      bookService.setToken(user.token)
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

  const handleLogout = async (event) => {
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

  useEffect(() => {
    console.log('effect')
    kissaService.getAll()
      .then(response => {
        setKissat(response)
        console.log(kissat)
      })
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      kissaService.setToken(user.token)
    }
  }, [])

  const addKissa = () => {
    //event.preventDefault()
    const uusiKissa = {
      nimi: 'Pekka Töpöhäntä',
      ika: 6
    }
    kissaService
      .create(uusiKissa)
      .then(response => {
        console.log(response)
        setKissat(kissat.concat(response))
        setKissa(response)
      })
      .catch(error => {
        console.log('Ei onnistunut :)')
      })
  }

  const muutaKissanIka = id => {
    const muutettavaKissa = kissa
    id = muutettavaKissa.id
    console.log('muutettavan kissan id', id)
    const muutettuKissa = { ...muutettavaKissa, ika: 1 }
    kissaService
      .update(muutettavaKissa.id, muutettuKissa)
      .then(response => {
        setKissat(kissat.map(kissa => kissa.id !== muutettavaKissa.id ? kissa : response))
        setKissa(muutettuKissa)
      })
      .catch(error => {
        console.log('Ei onnistunut :(')
      })
  }

  const getVille = id => {
    kissaService
      .getOne(id)
      .then(response => {
        setKissa(response)
      })
      .catch(error => {
        console.log('Ei onnistunut :)')
      })
  }

  const poistaKissa = id => {
    id = kissa.id
    console.log('poistettava id', id)
    kissaService
      .remove(id)
      .then(response => {
        setKissat(kissat.filter(k => k.id !== id))
        setKissa(kissat[indeksi])
      })
  }

  const handle = () => {
    let uusiIndeksi = 0
    let uusikissa = kissat[indeksi]
    setKissa(uusikissa)
    if (indeksi < kissat.length - 1) {
      uusiIndeksi = indeksi + 1
    }
    setIndeksi(uusiIndeksi)
    console.log('uusikissa', uusikissa)
  }

  const handleBooks = () => {
    finnaService.getAll()
      .then(result => {
        const bookInfo = result.records[0]
        const newBook = {
          title: bookInfo.title,
          authors: bookInfo.nonPresenterAuthors[0].name,
          languages: bookInfo.languages[0]
        }
        bookService.create(newBook)
          .then(result => console.log(result))
      })
      .catch(error => {
        console.log(error)
      })

  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username: <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password: <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  )

  const kissanapit = () => (
    <div >
      <p><button onClick={handleBooks}>Kirjat</button></p>
      <p><button onClick={handleLogout}>Logout</button></p>
      <button onClick={handle}>Napsauta!</button>
      <button onClick={addKissa}>Lisää kissa!</button>
      <button onClick={() => muutaKissanIka(kissa.id)}>Kissanpentu!</button>
      <button onClick={() => getVille('5e9b1c9f62614f36a401935e')}>Ville!</button>
      <button onClick={poistaKissa}>Poista kissa!</button>
      <Kissa nimi={kissa.nimi} ika={kissa.ika} />
    </div>
  )

  return (
    <div>
      {user === null ? loginForm() :
        <div>
          <p>{user.firstName} {user.lastName} on kirjautunut sisään.</p>
          {kissanapit()}
        </div>}
    </div>
  )
}

export default App
