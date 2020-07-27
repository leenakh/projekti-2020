import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import calendarService from '../services/calendar'
import { dateFormat } from '../components/DateFormat'
import { dateFormatReverse } from '../components/DateFormat'

const Calendar = ({ setBeginDate, setEndDate }) => {
    const books = useSelector(state => state.selectedBooks)
    const [calendarEntries, setCalendarEntries] = useState([])
    const [rows, setRows] = useState([])
    const [date, setDate] = useState('')

    useEffect(() => {
        const getCalendarEntries = async () => {
            const entries = await calendarService.search(books[0].title)
            setCalendarEntries(entries)
        }
        getCalendarEntries()

    }, [books])

    useEffect(() => {
        calendar('2020-08-10')
    }, [calendarEntries])

    const calendar = (date) => {
        let newDate = new Date(date)
        let reservations = []
        let i = 0
        for (i = 0; i < 300; i++) {
            let newDateString = newDate.toISOString().substring(0, 10)
            let result = calendarEntries.filter(c => c.date === newDateString)
            let dateString = dateFormat(newDateString)
            let names = result.map(c => c.user.username)
            const uniqueNames = [...new Set(names)]
            //const uniqueNamesArray = Array.from(uniqueNames)
            const namesTable = () => {
                return (
                    <div>
                        {uniqueNames.map(n =>
                            <div key={Math.random()}>
                                <span className="reservation-text">{n}</span><br />
                            </div>)}
                    </div>
                )
            }

            reservations = reservations.concat({ date: dateString, reservations: result.length, names: namesTable() })
            let nextDate = new Date(newDate)
            nextDate.setDate(nextDate.getDate() + 1)
            newDate = nextDate
        }
        formCalendar(reservations)
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
                let rs = row.reservation.concat(reservation)
                row = { ...row, reservation: rs }
                i++
                y++
            }
            rows = rows.concat(row)
        }
        setRows(rows)
    }

    const handleGetCalendar = () => {
        calendar(calendarEntries[0].date)
    }

    const handleChooseDate = (begin) => {
        const beginDate = dateFormatReverse(begin)
        setBeginDate(beginDate)
        const endDate = new Date(beginDate)
        endDate.setDate(endDate.getDate() + 28)
        const returnDate = endDate.toISOString().substring(0, 10)
        setEndDate(returnDate)
    }

    const handleMouseOver = (date) => {
        setDate(date)
    }

    const weekNumber = (row) => {
        let week = 0
        if (rows.indexOf(row) < 21) {
            week = rows.indexOf(row) + 33
        } else {
            week = rows.indexOf(row) - 20
        }
        return week
    }

    const CalendarCell = ({ reservation }) => {
        const style = () => {
            if (books.length - reservation.reservations === 0) {
                return {
                    backgroundColor: 'red',
                    border: 'none'
                }
            } else if (reservation.reservations === 0) {
                return {
                    backgroundColor: 'green',
                    border: 'none'
                }
            } else {
                return {
                    backgroundColor: 'yellow',
                    border: 'none'
                }
            }
        }
        return (
            <td style={style()} className="calendar-cell">
                <div className="calendar-date-container">
                    <div className="calendar-date">{date}</div>
                    <button id="calendar-button" style={style()} onMouseOver={() => handleMouseOver(reservation.date)} onClick={() => handleChooseDate(reservation.date)}>
                        <span className="reservation-text">varauksia: </span>
                        <span className="reservations">{reservation.reservations}</span>
                        <span className="reservation-text">varattavissa: </span>
                        <span className="reservations">{books.length - reservation.reservations}</span>
                        <span className="reservation-text">{reservation.names}</span>
                    </button>
                </div>
            </td>
        )
    }

    return (
        <div className="calendar-container">
            {calendarEntries === null ?
                <button onClick={handleGetCalendar}>Kalenteri</button> :
                <table className="calendar-table">
                    <tbody>
                        {rows.map(row => <tr key={Math.random()}>
                            <td className="calendar-cell">{weekNumber(row)}</td>
                            <CalendarCell reservation={row.reservation[0]} />
                            <CalendarCell reservation={row.reservation[1]} />
                            <CalendarCell reservation={row.reservation[2]} />
                            <CalendarCell reservation={row.reservation[3]} />
                            <CalendarCell reservation={row.reservation[4]} />
                        </tr>)}

                    </tbody>
                </table>
            }
        </div>
    )
}

export default Calendar