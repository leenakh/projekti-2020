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

const Info = ({ information }) => {
    return (
        <div>
            <table>
                <tbody>
                    {information.map(i =>
                            <tr key={i.propertyName}><td><b>{i.propertyName}</b></td><td>{i.propertyValue}</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Info