import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import calendarService from '../services/calendar'

const Calendar = () => {
    const books = useSelector(state => state.selectedBooks)
    const [calendarEntries, setCalendarEntries] = useState([])
    const [reservationCalendar, setReservationCalendar] = useState(null)
    const dateNow = new Date()

    useEffect(() => {
        const getCalendarEntries = async () => {
            const entries = await calendarService.search(books[0].title)
            console.log('calendarEntries', entries)
            setCalendarEntries(entries)
        }
        getCalendarEntries()
    }, [])

    const calendar = (date) => {
        let newDate = new Date(date)
        let reservations = []
        let i = 0
        for (i = 0; i < 90; i++) {
            let newDateString = newDate.toISOString().substring(0, 10)
            let result = calendarEntries.filter(c => c.date === newDateString)
            reservations = reservations.concat({ date: newDateString, reservations: result.length })
            let nextDate = new Date(newDate)
            nextDate.setDate(nextDate.getDate() + 1)
            newDate = nextDate
        }
        setReservationCalendar(reservations)
        console.log('reservationCalendar', reservationCalendar)
    }

    const handleGetCalendar = () => {
        calendar(dateNow)
    }

    const style = {
        textAlign: 'left'
    }

    return (
        <div>
            {reservationCalendar === null ?
                <button onClick={handleGetCalendar}>Kalenteri</button> :
                <table>
                    <tbody>
                        <tr><th style={style}></th></tr>
                        {reservationCalendar.map(c =>
                            <tr key={c.date}><td>{c.date}</td><td>{c.reservations}</td></tr>)}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default Calendar