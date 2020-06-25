import React, { useState } from 'react'
import reservationService from '../services/reservations'
import bookService from '../services/books'
import { useDispatch, useSelector } from 'react-redux'
import { setMessage } from '../reducers/messageReducer'
import { setErrorMessage } from '../reducers/errorMessageReducer'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import { setBooks } from '../reducers/booksReducer'
import calendarService from '../services/calendar'
import Confirmation from '../components/Confirmation'

const removalOfReservation = async (id, reservations, setReservations) => {
    const changedReservations = reservations.filter(r => r.id !== id)
    setReservations(changedReservations)
    await reservationService.remove(id)
}

export const removalOfCalendarEntry = async (id, reservation) => {
    const calendarEntries = await calendarService.search(reservation.book)
    let i = 0
    for (i = 0; i < calendarEntries.length; i++) {
        let entry = calendarEntries[i]
        if (entry.reservation === id) {
            await calendarService.remove(entry.id)
        }
    }
}

export const removalOfReservationFromBook = async (id, reservation, books, selectedBooks, dispatch) => {
    const search = `title=${reservation.book}&isbn=`
    const booksToChange = await bookService.search(search)
    let changedBooks = books
    let changedSelectedBooks = selectedBooks
    let i = 0
    for (i = 0; i < booksToChange.length; i++) {
        let bookToChange = booksToChange[i]
        let changedReservations = await bookToChange.reservations.filter(r => r.id !== id).map(r => r.id.toString())
        let changedBook = await bookService.update(bookToChange.id, { reservations: changedReservations })
        if (books.length < 0 && selectedBooks.length > 0) {
            changedBooks = await changedBooks.map(b => b.id === changedBook.id ? changedBook : b)
            changedSelectedBooks = await changedSelectedBooks.map(b => b.id === changedBook.id ? changedBook : b)
        }
    }
    dispatch(setBooks(changedBooks))
    dispatch(setSelectedBooks(changedSelectedBooks))
}

const RemoveReservation = ({ id, reservations, setReservations }) => {
    const dispatch = useDispatch()
    const books = useSelector(state => state.books)
    const selectedBooks = useSelector(state => state.selectedBooks)
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

    const remove = async () => {
        try {
            const reservation = await reservationService.getOne(id)
            //console.log('reservationToRemove', reservation)
            /* const search = `title=${reservation.book}&isbn=`
            const booksToChange = await bookService.search(search)
            let changedBooks = books
            let changedSelectedBooks = selectedBooks
            let i = 0
            for (i = 0; i < booksToChange.length; i++) {
                let bookToChange = booksToChange[i]
                let changedReservations = await bookToChange.reservations.filter(r => r.id !== id).map(r => r.id.toString())
                let changedBook = await bookService.update(bookToChange.id, { reservations: changedReservations })
                if (books.length < 0 && selectedBooks.length > 0) {
                    changedBooks = await changedBooks.map(b => b.id === changedBook.id ? changedBook : b)
                    changedSelectedBooks = await changedSelectedBooks.map(b => b.id === changedBook.id ? changedBook : b)
                }
            } */
            await removalOfReservationFromBook(id, reservation, books, selectedBooks, dispatch)
            await removalOfCalendarEntry(id, reservation)
            await removalOfReservation(id, reservations, setReservations)
            /* dispatch(setBooks(changedBooks))
            dispatch(setSelectedBooks(changedSelectedBooks)) */
            dispatch(setMessage('Varauksen poistaminen onnistui.'))
            setTimeout(() => {
                dispatch(setMessage(''))
            }, 5000)
        } catch (exception) {
            dispatch(setErrorMessage('Varauksen poistaminen ei onnistunut.'))
        }
    }

    const handleRemove = () => {
        setShowRemoveConfirm(true)
    }

    return (
        <div>
            {showRemoveConfirm !== false ?
                <>
                    <p>Haluatko varmasti poistaa varauksen?</p>
                    <Confirmation execute={remove} setShowConfirm={setShowRemoveConfirm} />
                </> :
                <button onClick={handleRemove}>Poista varaus</button>}
        </div>


    )
}

export default RemoveReservation