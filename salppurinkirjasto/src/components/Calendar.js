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
            let dateStringParts = newDateString.split('-')
            let dateString = `${dateStringParts[2]}.${dateStringParts[1]}.${dateStringParts[0]}`
            let names = result.map(c => c.user.username)
            const uniqueNames = [...new Set(names)]
            const uniqueNamesArray = Array.from(uniqueNames)
            const namesTable = () => {
                return (
                    < div>
                        {uniqueNamesArray.map(n =>
                            <div  key={Math.random()}>
                                <table><tbody><tr><td>{n}</td></tr></tbody></table>
                            </div>)}
                    </div>
                )
            }

            reservations = reservations.concat({ date: dateString, reservations: result.length, names: namesTable() })
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
        textAlign: 'left',
        minWidth: 300,
        fontWeight: 'bold'
    }

    return (
        <div>
            {reservationCalendar === null ?
                <button onClick={handleGetCalendar}>Kalenteri</button> :
                <table>
                    <caption style={style}>Varaukset - {books[0].title}</caption>
                    <tbody>
                        
                        {reservationCalendar.map(c =>
                            <tr key={Math.random()}>
                                <td>{c.date}</td>
                                <td>{c.reservations}/{books.length}</td>
                                <td>{c.names}</td>
                            </tr>)}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default Calendar