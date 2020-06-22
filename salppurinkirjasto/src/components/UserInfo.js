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
import ReservationInfo from '../components/Reservation'
import Info from '../components/Info'

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

    /* const Info = ({reservation}) => {
        const showReceived = (received) => {
            if (received === false) {
                return 'Ei'
            }
            return 'Kyllä'
        }

        return (
            <div>
                <h4>{reservation.book}</h4>
                <table>
                    <tbody>
                        <tr><td>Lunastettu:</td><td>{showReceived(reservation.received)}</td></tr>
                        <tr><td>Niteiden lukumäärä:</td><td>{reservation.numberOfCopies}</td></tr>
                        <tr><td>Aika:</td><td>{reservation.beginDate} - {reservation.endDate}</td></tr>
                    </tbody>
                </table>
            </div>
        )
    } */

    const showInfo = (information) => {
        const title = { propertyName: `Nimeke`, propertyValue: `${information[0]}` }
        const copies = { propertyName: `Niteitä`, propertyValue: `${information[1]}` }
        const statusValue = () => {
            if (information[2] === false) {
                return 'Ei'
            }
            return 'Kyllä'
        }
        const beginParts = information[3].split('-')
        const endParts = information[4].split('-')
        const begin = { propertyName: 'Alkaa', propertyValue: `${beginParts[2]}.${beginParts[1]}.${beginParts[0]}` }
        const end = { propertyName: 'Päättyy', propertyValue: `${endParts[2]}.${endParts[1]}.${endParts[0]}` }
        const status = { propertyName: `Lunastettu`, propertyValue: `${statusValue()}` }
        return [title, copies, status, begin, end]
    }

    if (user) {
        return (
            <div>
                <h3>Omat varaukset</h3>
                <ul id="books">
                    {reservations.map(r =>
                        <li id="reservation" key={r.id}>
                            <Info information={showInfo([r.book, r.numberOfCopies, r.received, r.beginDate, r.endDate])} />
                        </li>)}
                </ul>
            </div>
        )
    }
    return null
}

export default UserInfo