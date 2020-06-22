import React, { useState } from 'react'
import Confirmation from '../components/Confirmation'
import Calendar from '../components/Calendar'
import { useDispatch, useSelector } from 'react-redux'
import { setMessage } from '../reducers/messageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import { setBooks, fetchBook } from '../reducers/booksReducer'
import { setBookTitles } from '../reducers/bookTitlesReducer'
import reservationService from '../services/reservations'
import bookService from '../services/books'
import calendarService from '../services/calendar'
import Info from '../components/Info'

export const reservationMessage = 'Kirjan varaaminen onnistui.'
export const reservationFailMessage = 'Kirjan varaaminen ei onnistunut.'

const Reservation = ({ beginDate, setBeginDate, endDate, setEndDate }) => {
    const dispatch = useDispatch()
    const books = useSelector(state => state.books)
    const selectedBooks = useSelector(state => state.selectedBooks)
    const [numberOfCopies, setNumberOfCopies] = useState(0)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showReservationInfo, setShowReservationInfo] = useState(false)
    const [reservationToMake, setReservationToMake] = useState(null)

    let bookToReserve = ''
    if (selectedBooks) {
        bookToReserve = selectedBooks[0].title
    }

    const dateNow = new Date().toISOString().substring(0, 10)
    const handleDate = (selectedDate) => {
        const date = new Date(selectedDate).toISOString().substring(0, 10)
        setBeginDate(date)
        const end = new Date(date)
        end.setDate(end.getDate() + 28)
        const returnDate = end.toISOString().substring(0, 10)
        setEndDate(returnDate)
    }
    const beginDateParts = beginDate.split('-')
    const beginDateString = `${beginDateParts[2]}.${beginDateParts[1]}.${beginDateParts[0]}`
    const endDateParts = endDate.split('-')
    const endDateString = `${endDateParts[2]}.${endDateParts[1]}.${endDateParts[0]}`

    const showInfo = (information) => {
        const title = { propertyName: `Nimeke`, propertyValue: `${information[0]}` }
        const copies = { propertyName: `Niteitä`, propertyValue: `${information[1]}` }
        const beginParts = information[2].split('-')
        const endParts = information[3].split('-')
        const begin = { propertyName: 'Alkaa', propertyValue: `${beginParts[2]}.${beginParts[1]}.${beginParts[0]}` }
        const end = { propertyName: 'Päättyy', propertyValue: `${endParts[2]}.${endParts[1]}.${endParts[0]}` }
        return [title, copies, begin, end]
    }

    const makeReservation = async () => {
        try {
            const reservation = {
                beginDate: beginDate,
                endDate: endDate,
                book: bookToReserve,
                numberOfCopies: numberOfCopies
            }
            const booksToReserve = selectedBooks
            if (booksToReserve.length < reservation.numberOfCopies) {
                dispatch(setErrorMessage(`Liian vähän niteitä varattavissa (${booksToReserve.length} nidettä).`))
                setTimeout(() => {
                    dispatch(setErrorMessage(''))
                }, 5000)
                setShowConfirm(false)
                return
            }
            const returnedReservation = await reservationService.create(reservation)
            const availableCopies = await bookService.getAvailability({ books: booksToReserve, reservation: returnedReservation })
            if (availableCopies.length < returnedReservation.numberOfCopies) {
                dispatch(setErrorMessage(`Liian vähän niteitä varattavissa (${availableCopies.length} nidettä).`))
                setTimeout(() => {
                    dispatch(setErrorMessage(''))
                }, 5000)
                setShowConfirm(false)
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
                    let returnedCalendarEntry = await calendarService.create({ title: changedBook.title, reservation: returnedReservation })
                    console.log('returnedCalendar', returnedCalendarEntry)
                }
            }
            setShowReservationInfo(false)
            dispatch(setSelectedBooks((changedBooks)))
            dispatch(setBooks(booksToChange))
            dispatch(setBookTitles(null))
            dispatch(setMessage(reservationMessage))
            setTimeout(() => {
                dispatch(setMessage(''))
            }, 10000)
        } catch (exception) {
            dispatch(setErrorMessage(reservationFailMessage))
            setTimeout(() => {
                dispatch(setErrorMessage(''))
            }, 5000)
            console.log('Virhe!')
        }
    }

    const removeReservation = async (id) => {
        try {
            const reservation = await reservationService.getOne(id)
            const search = `title=${reservation.book}&isbn=`
            const booksToChange = await bookService.search(search)
            let changedBooks = books
            let changedSelectedBooks = selectedBooks
            let i = 0
            let y = 0
            for (i = 0; i < booksToChange.length; i++) {
                let bookToChange = booksToChange[i]
                let changedReservations = await bookToChange.reservations.filter(r => r.id !== id).map(r => r.id.toString())
                let changedBook = await bookService.update(bookToChange.id, { reservations: changedReservations })
                changedBooks = await changedBooks.map(b => b.id === changedBook.id ? changedBook : b)
                changedSelectedBooks = await changedSelectedBooks.map(b => b.id === changedBook.id ? changedBook : b)
            }
            const calendarEntries = await calendarService.search(reservation.book)
            for (y = 0; y < calendarEntries.length; y++) {
                let entry = calendarEntries[y]
                if (entry.reservation === id) {
                    await calendarService.remove(entry.id)
                }
            }
            await reservationService.remove(id)
            dispatch(setBooks(changedBooks))
            dispatch(setSelectedBooks(changedSelectedBooks))
            dispatch(setMessage('Varauksen poistaminen onnistui.'))
            setTimeout(() => {
                dispatch(setMessage(''))
            }, 5000)
        } catch (exception) {
            console.log('Pieleen meni.')
        }
    }

    const handleMakeReservation = async (event) => {
        event.preventDefault()
        setShowConfirm(true)
        setShowReservationInfo(true)
    }

    return (
        <>
            <button onClick={() => removeReservation('5eeb942c69468117c859febc')}>Poista varaus</button>
            <Calendar />
            <div>
                {bookToReserve !== '' ? <p>{bookToReserve}</p> : <p>Ei valittua kirjaa</p>}
            </div>
            <form id="reserve" onSubmit={handleMakeReservation}>
                <div>
                    <p>Alkupäivä: <input type="date" value={beginDate} min={dateNow} required pattern="\d{4}-\d{2}-\d{2}" id="beginDate" onChange={({ target }) => handleDate(target.value)} /></p>
                    <p>Loppupäivä: <input type="date" value={endDate} min={beginDate} id="endDate" onChange={({ target }) => setEndDate(target.value)} /></p>
                    <p>Määrä: <input type="number" value={numberOfCopies} id="numberOfBooks" onChange={({ target }) => setNumberOfCopies(target.value)} /></p>
                </div>
                <div>
                    <button id="borrow-button" type="submit">Varaa kirja</button>
                </div>
            </form>
            <div>
                {showReservationInfo !== false ? <Info information={showInfo([bookToReserve, numberOfCopies, beginDate, endDate])} /> : null}
                {showConfirm !== false ? <Confirmation execute={makeReservation} setShowConfirm={setShowConfirm} /> : null}
            </div>
        </>
    )
}

export default Reservation