import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import { setBooks, fetchBook } from '../reducers/booksReducer'

export const BookInfo = ({ bookTitle }) => {
  const books = useSelector(state => state.books)
  const title = useSelector(state => state.title)
  const isbn = useSelector(state => state.isbn)
  const [book, setBook] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    dispatch(fetchBook(title, isbn))
  }, [])

  const handleSelectBookFromListOfTitles = (bookTitle) => {
    try {
      const booksForSelection = books.filter(b => b.title === bookTitle)
      setBook(booksForSelection[0])
      dispatch(setSelectedBooks(booksForSelection))
      dispatch(setBooks(booksForSelection))
      history.push("/lainaa")
    } catch (exception) {
      dispatch(setErrorMessage('Kirjoja ei löytynyt.'))
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
  }

  const handleReserve = (bookTitle) => {
    const booksForSelection = books.filter(b => b.title === bookTitle)
    dispatch(setSelectedBooks(booksForSelection))
    history.push("/varaus")
  }

  const toggleShowInfo = async () => {
    const booksForSelection = books.filter(b => b.title === bookTitle)
    setBook(booksForSelection[0])
    setShowInfo(!showInfo)
  }

  return (
    <>
      <button className="title" onClick={() => toggleShowInfo()} >{bookTitle}</button>
      {showInfo ?
        <>
          <div className="authors">
            <ul>
              {book.authors.map(a =>
                <div className="author-name" key={a.name}>{a.name}</div>)}
              {book.published ?
                <li><div className="year">{book.published}</div></li> : null}
            </ul>
          </div>
          <div className="reserve-borrow-button-container"><button className="borrow-return-button" onClick={() => handleSelectBookFromListOfTitles(bookTitle)}>Lainaa</button>
            <button className="reserve-button" onClick={() => handleReserve(bookTitle)}>Varaa</button></div>
        </> : null}
    </>
  )
}

const SelectTitle = () => {
  const bookTitles = useSelector(state => state.bookTitles)

  return (
    <div className="book-info-list-container">
      <ul>
        <li><p>Löytyi <b>{bookTitles.length}</b> {bookTitles.length === 1 ? 'nimeke' : 'nimekettä'}.</p></li>
        {bookTitles.map(t =>
          <li className="book-info-list-item" key={t}>
            <div>
              <BookInfo bookTitle={t} />
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SelectTitle