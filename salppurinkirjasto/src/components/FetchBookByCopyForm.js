import React from 'react'
import { setCopy } from '../reducers/copyReducer'
import { setBooks } from '../reducers/booksReducer'
import { useDispatch, useSelector } from 'react-redux'
import { setErrorMessage } from '../reducers/errorMessageReducer'

const FetchBookByCopyForm = () => {
  const selectedBooks = useSelector(state => state.selectedBooks)
  const copy = useSelector(state => state.copy)
  const dispatch = useDispatch()
  const handleFetchBookByCopy = async (event) => {
    event.preventDefault()
    const selectedCopies = selectedBooks.filter(b => b.copy === copy)
    if (selectedCopies.length < 1) {
      dispatch(setErrorMessage('Nidettä ei löytynyt.'))
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
      dispatch(setBooks(selectedBooks))
    } else {
      dispatch(setBooks(selectedCopies))
      dispatch(setCopy(''))
    }
  }

  return (
    <form onSubmit={handleFetchBookByCopy}>
      <div>
        <h3>Hae kirja niteen numeron perusteella</h3>
        Copy: <input id="copy" type="text" value={copy} name="copy" onChange={({ target }) => dispatch(setCopy(target.value))} />
      </div>
      <div>
        <button id="fetchCopy" type="submit">Lähetä</button>
      </div>
    </form>
  )
}

export default FetchBookByCopyForm