import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessage } from '../reducers/messageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import { setBooks } from '../reducers/booksReducer'
import reservationService from '../services/reservations'
import bookService from '../services/books'

const Reservation = ({ beginDate, setBeginDate, endDate, setEndDate }) => {
    const books = useSelector(state => state.books)
    const selectedBooks = useSelector(state => state.selectedBooks)
    const [numberOfCopies, setNumberOfCopies] = useState(0)
    let bookToReserve = ''
    if (selectedBooks) {
        bookToReserve = selectedBooks[0].title
    }
    const dispatch = useDispatch()
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
        käy läpi selectedBooks ja tutki, mitkä ovat lainassa tai varattuja määriteltynä aikana
        laske varattavissa olevien määrä -> kerro käyttäjälle, kuinka monta on
        pyydä vaihtamaan määrää tai aikaväliä, jos liian vähän kirjoja varattavissa
        jos kirjoja tarpeeksi, käy lista läpi ja merkitse varaus pyydetylle määrälle kirjoja

    } */

    const handleMakeReservation = async (event) => {
        event.preventDefault()
        const beginDateParts = beginDate.split('-')
        const beginDateString = `${beginDateParts[2]}.${beginDateParts[1]}.${beginDateParts[0]}`
        const endDateParts = endDate.split('-')
        const endDateString = `${endDateParts[2]}.${endDateParts[1]}.${endDateParts[0]}`
        try {
            const reservation = {
                beginDate: beginDate,
                endDate: endDate,
                book: bookToReserve,
                numberOfCopies: numberOfCopies
            }
            const booksToReserve = selectedBooks
            if (booksToReserve.length < reservation.numberOfCopies) {
                dispatch(setErrorMessage('Liian vähän niteitä varattavissa'))
                setTimeout(() => {
                    dispatch(setErrorMessage(''))
                }, 5000)
            }
            const returnedReservation = await reservationService.create(reservation)
            const availableCopies = await bookService.getAvailability({ books: booksToReserve, reservation: returnedReservation })
            if (availableCopies.length < returnedReservation.numberOfCopies) {
                console.log('Liian vähän niteitä varattavissa.')
                return
            }
            let i = 0
            let numberOfReservedBooks = 0
            let booksToChange = books
            let changedBooks = selectedBooks
            let reservations = []
            for (i = 0; i < availableCopies.length && numberOfReservedBooks < returnedReservation.numberOfCopies; i++) {
                let bookId = availableCopies[i].id
                let book = await bookService.getOne(bookId)
                if (book.reservations) {
                    reservations = book.reservations.map(r => r.id).concat(returnedReservation.id)
                } else {
                    reservations = reservations.concat(returnedReservation.id)
                }
                let changedBook = await bookService.update(bookId, { reservations: reservations })
                if (!changedBook) {
                    changedBooks = [...changedBooks, book]
                } else if (changedBook) {
                    numberOfReservedBooks++
                    booksToChange = booksToChange.map(b => b.id !== changedBook.id ? b : changedBook)
                    changedBooks = changedBooks.map(b => b.id !== changedBook.id ? b : changedBook)
                    
                }
            }
            dispatch(setSelectedBooks((changedBooks)))
            dispatch(setBooks(booksToChange))
            dispatch(setMessage(`Kirjan varaus onnistui: ${returnedReservation.numberOfCopies} nidettä ajalle ${beginDateString} - ${endDateString}.`))
                    setTimeout(() => {
                        dispatch(setMessage(''))
                    }, 10000)
        } catch (exception) {
            dispatch(setErrorMessage('Kirjan varaus ei onnistunut.'))
            setTimeout(() => {
                dispatch(setErrorMessage(''))
            }, 5000)
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