import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import calendarService from '../services/calendar'

const Calendar = () => {
    const books = useSelector(state => state.selectedBooks)
    const [calendar, setCalendar] = useState([])

    useEffect(() => {
        const getCalendar = async () => {
            const entries = await calendarService.search(books[0].title)
            console.log('calendarEntries', entries)
            setCalendar(entries)
        }
        getCalendar()
        console.log('calendarState', calendar)
    }, [])



    const style = {
        textAlign: 'left'
    }
    if (calendar) {
        return (
            <table>
                <tbody>
                    <tr><th style={style}></th></tr>
                    {calendar.map(c =>
                        <tr key={c.id}><td>{c.date}</td><td>{c.title}</td></tr>)}
                </tbody>
            </table>
        )
    }
    return null
}

export default Calendar