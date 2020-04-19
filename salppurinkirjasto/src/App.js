import React, { useState, useEffect } from 'react'
import Kissa from './components/Kissa'
import './App.css';
import kissaService from './services/kissat'

const App = () => {

  const [kissa, setKissa] = useState({ id: 7, nimi: 'Kalle', ika: 0 })
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

  if (kissa) {
    return (
      <div >
        <button onClick={handle}>Napsauta!</button>
        <button onClick={addKissa}>Lisää kissa!</button>
        <button onClick={() => muutaKissanIka(kissa.id)}>Kissanpentu!</button>
        <button onClick={() => getVille('5e9b1c9f62614f36a401935e')}>Ville!</button>
        <button onClick={poistaKissa}>Poista Kissa!</button>
        <Kissa nimi={kissa.nimi} ika={kissa.ika} />
      </div>
    )
  } else {
    return null
  }
}

export default App
