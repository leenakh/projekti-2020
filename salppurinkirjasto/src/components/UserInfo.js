import React, { useState, useEffect } from 'react'
import reservationService from '../services/reservations'
import Info from '../components/Info'
import RemoveReservation from '../components/RemoveReservation'
import ReceiveReservation from '../components/ReceiveReservation'
import DisableReservation from './DisableReservation'
import { dateFormat } from '../components/DateFormat'

const UserInfo = ({ user, setBeginDate, setEndDate }) => {
    const [reservations, setReservations] = useState([])
    const [reservationsToShow, setReservationsToShow] = useState([])
    const [showDisabled, setShowDisabled] = useState(false)
    const [toggleText, setToggleText] = useState('Kaikki')

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
        const course = { propertyName: 'Opetusryhmä', propertyValue: `${information[5]}` }
        const begin = { propertyName: 'Alkaa', propertyValue: dateFormat(information[3]) }
        const end = { propertyName: 'Päättyy', propertyValue: dateFormat(information[4]) }
        const status = { propertyName: `Lunastettu`, propertyValue: `${statusValue()}` }
        return [title, copies, status, begin, end, course]
    }

    const toggle = () => {
        setShowDisabled(!showDisabled)
        setToggleText(showDisabled === true ? 'Kaikki' : 'Aktiiviset')
        filterReservations(reservations, showDisabled)
    }

    const filterReservations = (reservations, showDisabled) => {
        if (showDisabled) {
            setReservationsToShow(reservations.filter(r => r.received === false && new Date().getTime() - new Date(r.endDate).getTime() <= 86400000))
        } else {
            setReservationsToShow(reservations)
        }
    }

    if (user) {
        return (
            <div className="user-info-container">
                <h3>Omat varaukset</h3>
                <button className="filter" onClick={toggle}>{toggleText}</button>
                <ul id="books">
                    {reservationsToShow.map(r =>
                        <li id="reservation" key={r.id}>
                            <Info information={showInfo([r.book, r.numberOfCopies, r.received, r.beginDate, r.endDate, r.course])} />
                            <div className="button-container">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><RemoveReservation id={r.id} reservations={reservations} setReservations={setReservations} /></td>
                                            <td>{r.received === false ? <ReceiveReservation id={r.id} setBeginDate={setBeginDate} setEndDate={setEndDate} /> : null}</td>
                                            <td>{r.received === false ? <DisableReservation id={r.id} reservations={reservations} setReservations={setReservations} /> : null}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>)}
                </ul>
            </div>
        )
    }
    return null
}

export default UserInfo