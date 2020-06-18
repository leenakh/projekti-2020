import React, { useState, useEffect } from 'react'
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

const UserInfo = ({ user }) => {
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        const usersReservations = async () => {
            const reservations = await reservationService.getReservations(user.username)
            console.log('reservations', reservations)
            console.log('user.username', user.username)
            setReservations(reservations)
        }
        usersReservations()
    }, [])

    if (user) {
        return (
            <div>
                <h3>{user.firstName} {user.lastName}</h3>
                <h3>Omat varaukset</h3>
                <ul id="books">
                    {reservations.map(r =>
                        <li id="reservation" key={r.id}>
                            {r.book}, {r.beginDate}
                        </li>)}
                </ul>
            </div>
        )
    }
    return null
}

export default UserInfo