import React from 'react'

const FetchBookByCopyForm = ({setBooks, selectedBooks, copy, setCopy, setErrorMessage}) => {
  const handleFetchBookByCopy = async (event) => {
    event.preventDefault()
    try {
      const selectedCopies = selectedBooks.filter(b => b.copy === copy)
      setBooks(selectedCopies)
      setCopy('')
    } catch (exception) {
      setErrorMessage('Nidettä ei löytynyt.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  return (
    <form onSubmit={handleFetchBookByCopy}>
      <div>
          <h3>Hae kirja niteen numeron perusteella</h3>
        Copy: <input id="copy" type="text" value={copy} name="copy" onChange={({ target }) => setCopy(target.value)} />
      </div>
      <div>
        <button id="fetchCopy" type="submit">Lähetä</button>
      </div>
    </form>
  )}

  export default FetchBookByCopyForm