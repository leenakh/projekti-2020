import React, { useState, useEffect } from 'react'
import reservationService from '../services/reservations'
import Info from '../components/Info'
import RemoveReservation from '../components/RemoveReservation'

const UserInfo = ({ user }) => {
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        const usersReservations = async () => {
            const reservations = await reservationService.getReservations(user.username)
            setReservations(reservations)
        }
        usersReservations()
    }, [])

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
                            <RemoveReservation id={r.id} reservations={reservations} setReservations={setReservations} />
                        </li>)}
                </ul>
            </div>
        )
    }
    return null
}

export default UserInfo