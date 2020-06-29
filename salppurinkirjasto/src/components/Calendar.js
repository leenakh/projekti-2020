import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import calendarService from '../services/calendar'

const Calendar = () => {
    const books = useSelector(state => state.selectedBooks)
    const [calendarEntries, setCalendarEntries] = useState([])
    const [reservationCalendar, setReservationCalendar] = useState(null)
    const [rows, setRows] = useState([])
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
        //const finalDate = new Date('2021-06-01')
        let reservations = []
        let i = 0
        for (i = 0; i < 300; i++) {
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
                            <div key={Math.random()}>
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
        formCalendar(reservations)
        console.log('reservationCalendar', reservationCalendar)
    }

    const formCalendar = (reservations) => {
            let row = { reservation: [] }
            let rows = []
            let i = 0
            let y = 0
            while (y < reservations.length) {
                row = { reservation: [] }
                i = 0
                while (i < 7) {
                    let reservation = reservations[y]
                    console.log('reservation', reservation)
                    let rs = row.reservation.concat(reservation)
                    row = { ...row, reservation: rs }
                    console.log('row', row)
                    i++
                    y++
                }
                rows = rows.concat(row)
                console.log('rows', rows)
            
        }
        setRows(rows)
    }

    const handleGetCalendar = () => {
        calendar(calendarEntries[0].date)
    }

    const style = {
        textAlign: 'left',
        minWidth: 600,
        fontWeight: 'bold'
    }

    return (
        <div>
            {reservationCalendar === null ?
                <button onClick={handleGetCalendar}>Kalenteri</button> :
                <table>
                    <caption style={style}>Varaukset - {books[0].title}</caption>
                    <tbody>
                    {rows.map(row => <tr key={Math.random()}>
                    <td>{row.reservation[0].date}<br/>varauksia: {row.reservation[0].reservations}<br/>varattavissa: {books.length - row.reservation[0].reservations}<br/>{row.reservation[0].names}</td>
                    <td>{row.reservation[1].date}<br/>varauksia: {row.reservation[1].reservations}<br/>varattavissa: {books.length - row.reservation[1].reservations}<br/>{row.reservation[1].names}</td>
                    <td>{row.reservation[2].date}<br/>varauksia: {row.reservation[2].reservations}<br/>varattavissa: {books.length - row.reservation[2].reservations}<br/>{row.reservation[2].names}</td>
                    <td>{row.reservation[3].date}<br/>varauksia: {row.reservation[3].reservations}<br/>varattavissa: {books.length - row.reservation[3].reservations}<br/>{row.reservation[3].names}</td>
                    <td>{row.reservation[4].date}<br/>varauksia: {row.reservation[4].reservations}<br/>varattavissa: {books.length - row.reservation[4].reservations}<br/>{row.reservation[4].names}</td>
                    <td>{row.reservation[5].date}<br/>varauksia: {row.reservation[5].reservations}<br/>varattavissa: {books.length - row.reservation[5].reservations}<br/>{row.reservation[5].names}</td>
                        
                        </tr>)}
                        
                    </tbody>
                </table>
            }
        </div>
    )
}

export default Calendar