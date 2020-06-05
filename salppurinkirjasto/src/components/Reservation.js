import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setBook } from '../reducers/bookReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import reservationService from '../services/reservations'
import bookService from '../services/books'

const Reservation = ({ beginDate, setBeginDate, endDate, setEndDate }) => {
    const books = useSelector(state => state.books)
    const book = useSelector(state => state.selectedBooks)
    const [reservedBook, setReservedBook] = useState('')
    const [numberOfCopies, setNumberOfCopies] = useState(0)
    let bookToReserve = ''
    if (book) {
        bookToReserve = book[0].title
    }
    const dispatch = useDispatch()
    //const [start, setStart] = useState(today)
    const handleDate = (selectedDate) => {
        const date = new Date(selectedDate).toISOString().substring(0, 10)
        setBeginDate(date)
        const end = new Date(date)
        end.setDate(end.getDate() + 28)
        const returnDate = end.toISOString().substring(0, 10)
        setEndDate(returnDate)
    }

    /* const varaaKirja = () => {
        (selectedBooks sisältää myös ne niteet, joihin on voimassa oleva varaus)
        (backend ei hyväksy varatun kirjan lainauspyyntöä)
        käy läpi selectedBooks ja tutki, mitkä ovat lainassa
        laske varattavissa olevien määrä -> kerro käyttäjälle, kuinka monta on
        pyydä vaihtamaan määrää tai aikaväliä, jos liian vähän kirjoja varattavissa
        jos kirjoja tarpeeksi, käy lista läpi ja merkitse varaus pyydetylle määrälle kirjoja

    } */

    const handleMakeReservation = async (event) => {
        event.preventDefault()
        try {
            const reservation = {
                beginDate: beginDate,
                endDate: endDate,
                book: bookToReserve,
                numberOfCopies: numberOfCopies
            }
            //const booksToReserve = book.filter(b => !b.loan)
            console.log('booksToReserve', booksToReserve)
            if (booksToReserve.length < reservation.numberOfCopies) {
                dispatch(setErrorMessage('Liian vähän niteitä varattavissa'))
            }
            const returnedReservation = await reservationService.create(reservation)
            console.log('Varasin!', returnedReservation)
            console.log('returnedReservation.id', returnedReservation.id)
            console.log('bookId', book[0].id)
            let i = 0
            for (i = 0; i < booksToReserve.length; i++) {
                let bookId = booksToReserve[i].id
                bookService.update(bookId, { reservationId: returnedReservation.id })
            }
        } catch (exception) {
            console.log('Virhe!')
        }
    }

    return (
        <>
            <div>
                {bookToReserve !== '' ? <p>{bookToReserve}</p> : <p>Ei valittua kirjaa</p>}
            </div>
            <form id="reserve" onSubmit={handleMakeReservation}>
                <div>
                    <p>Alkupäivä: <input type="date" value={beginDate} required pattern="\d{4}-\d{2}-\d{2}" id="beginDate" onChange={({ target }) => handleDate(target.value)} /></p>
                    <p>Loppupäivä: <input type="date" value={endDate} id="endDate" onChange={({ target }) => setEndDate(target.value)} /></p>
                    <p>Määrä: <input type="number" value={numberOfCopies} id="numberOfBooks" onChange={({ target }) => setNumberOfCopies(target.value)} /></p>
                </div>
                <div>
                    <button id="borrow-button" type="submit">Varaa kirja</button>
                </div>
            </form>
        </>
    )
}

export default Reservation