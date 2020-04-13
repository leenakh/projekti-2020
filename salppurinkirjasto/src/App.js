import React, { useState, useEffect } from 'react'
import Kissa from './components/Kissa'
import './App.css';
import axios from 'axios'

const App = () => {

  const [kissa, setKissa] = useState()

  let kissat = []

  axios.get('http://localhost:3001/kissat')
      .then(response => {
        kissat = response.data
        console.log(kissat)
      })

const handle = () => {
  let uusikissa = kissat[0]
  setKissa(uusikissa)
  console.log('uusikissa', uusikissa)
  console.log(kissa)
}
if (kissa) {
  return (
    <div >
      <button onClick={handle}>Napsauta!</button>
      <Kissa nimi={kissa.nimi} ika={kissa.ika} />
    </div>
  )
} else {
  return <button onClick={handle}>Napsauta!</button>
}

}

export default App;
