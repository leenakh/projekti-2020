import React, { useState, useEffect } from 'react'
import reservationService from '../services/reservations'
import Info from '../components/Info'
import RemoveReservation from '../components/RemoveReservation'
import ReceiveReservation from '../components/ReceiveReservation'
import Books from '../components/Books'
import DisableReservation from './DisableReservation'

const UserInfo = ({ user, borrowingBookForm }) => {
    const [reservations, setReservations] = useState([])
    const [reservationsToShow, setReservationsToShow] = useState([])
    const [showBorrow, setShowBorrow] = useState('')
    const [showDisabled, setShowDisabled] = useState(false)
    const [toggleText, setToggleText] = useState('Näytä kaikki varaukset')

    useEffect(() => {
        const usersReservations = async () => {
            const reservations = await reservationService.getReservations(user.username)
            filterReservations(reservations, true)
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

    const toggle = () => {
        setShowDisabled(!showDisabled)
        setToggleText(showDisabled === true ? 'Näytä kaikki varaukset' : 'Näytä aktiiviset varaukset')
        filterReservations(reservations, showDisabled)
    }

    const filterReservations = (reservations, showDisabled) => {
        if (showDisabled) {
            setReservationsToShow(reservations.filter(r => r.received === false))
        } else {
            setReservationsToShow(reservations)
        }
    }

    if (user) {
        return (
            <>
                <div>
                    <h3>Omat varaukset</h3>
                    <button onClick={toggle}>{toggleText}</button>
                    <ul id="books">
                        {reservationsToShow.map(r =>
                            <li id="reservation" key={r.id}>
                                <Info information={showInfo([r.book, r.numberOfCopies, r.received, r.beginDate, r.endDate])} />
                                <RemoveReservation id={r.id} reservations={reservations} setReservations={setReservations} />
                                {r.received === false ? <ReceiveReservation id={r.id} setShowBorrow={setShowBorrow} /> : null}
                                {r.received === false ? <DisableReservation id={r.id} reservations={reservations} setReservations={setReservations} /> : null}
                            </li>)}
                    </ul>
                </div>
            </>
        )
    }
    return null
}

export default UserInfo