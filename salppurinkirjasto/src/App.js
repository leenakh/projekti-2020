import React, { useState, useEffect } from 'react'
import Kissa from './components/Kissa'
import './App.css';
import kissaService from './services/kissat'

const App = () => {

  const [kissa, setKissa] = useState({id: 7, nimi: 'Kalle', ika: 0})
  const [kissat, setKissat] = useState([])
  const [indeksi, setIndeksi] = useState(0)

  useEffect(() => {
    console.log('effect')
    kissaService.getAll()
      .then(response => {
        setKissat(response)
        console.log(kissat)
      })
  }, [])

  const addKissa = () => {
    //event.preventDefault()
    const uusiKissa = {
      id: 11,
      nimi: 'Kissa',
      ika: 11
    }
    kissaService
      .create(uusiKissa)
      .then(response => {
        console.log(response)
        setKissat(kissat.concat(response))
      })
      .catch(error => {
        console.log('Ei onnistunut :)')
      })
  }

  const muutaKissanIka = id => {
    const url = `http://localhost:3001/kissat/${id}`
    const kissa = kissat.find(kissa => kissa.id === id)
    const muutettuKissa = {...kissa, ika: 1}
    kissaService
    .update(id, muutettuKissa)
    .then(response => {
      setKissat(kissat.map(kissa => kissa.id !== id ? kissa : response))
      setKissa(muutettuKissa)
    })
    .catch(error => {
      console.log('Ei onnistunut :)')
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
    kissaService
    .remove(id)
    .then(response => {
      setKissat(kissat.map(kissa => kissa.id !== id))
      console.log('kissat', kissat)
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
    console.log(kissa)
  }

  if (kissa) {
    return (
      <div >
        <button onClick={handle}>Napsauta!</button>
        <button onClick={addKissa}>Lisää kissa!</button>
        <button onClick={() => muutaKissanIka(kissa.id)}>Kissanpentu!</button>
        <button onClick={() => getVille(2)}>Ville!</button>
        <button onClick={() => poistaKissa(5)}>Poista Kissa!</button>
        <Kissa nimi={kissa.nimi} ika={kissa.ika} />
      </div>
    )
  } else {
    return null
  }
}

export default App
