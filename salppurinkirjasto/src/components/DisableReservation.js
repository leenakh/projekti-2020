import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import bookService from '../services/books'
import reservationService from '../services/reservations'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import { setBook } from '../reducers/bookReducer'
import { removalOfReservationFromBook } from '../components/RemoveReservation'
import { removalOfCalendarEntry } from '../components/RemoveReservation'

const DisableReservation = ({ id, reservations, setReservations }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const books = useSelector(state => state.books)
    const selectedBooks = useSelector(state => state.selectedBooks)

    const handleDisableReservation = async () => {
        try {
            const reservation = await reservationService.getOne(id)
            await removalOfReservationFromBook(id, reservation, books, selectedBooks, dispatch)
            await removalOfCalendarEntry(id, reservation)
            const returnedReservation = await reservationService.update(id, {...reservation, received: true})
            setReservations(reservations.map(r => r.id === id ? returnedReservation : r))
        } catch (exception) {
            console.log('Hups')
        }
    }

    return (
        <div>
            <button onClick={handleDisableReservation} >Arkistoi varaus</button>
        </div>
    )
}

export default DisableReservation