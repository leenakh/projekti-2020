import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import reservationService from '../services/reservations'
import { removalOfReservationFromBook } from '../components/RemoveReservation'
import { removalOfCalendarEntry } from '../components/RemoveReservation'
import Confirmation from '../components/Confirmation'

const DisableReservation = ({ id, reservationsToShow, setReservationsToShow, reservations, setReservations }) => {
    const dispatch = useDispatch()
    const books = useSelector(state => state.books)
    const selectedBooks = useSelector(state => state.selectedBooks)
    const [showDisableConfirm, setShowDisableConfirm] = useState(false)

    const disableReservation = async () => {
        try {
            const reservation = await reservationService.getOne(id)
            await removalOfReservationFromBook(id, reservation, books, selectedBooks, dispatch)
            await removalOfCalendarEntry(id, reservation)
            const returnedReservation = await reservationService.update(id, { ...reservation, received: true })
            setReservations(reservations.map(r => r.id === id ? returnedReservation : r))
            setReservationsToShow(reservationsToShow.map(r => r.id === id ? returnedReservation : r))
        } catch (exception) {
            console.log('Hups')
        }
    }

    const handleDisableReservation = async () => {
        setShowDisableConfirm(true)
    }

    return (
        <div>
            {showDisableConfirm ? <><div className="confirmation-text">Haluatko arkistoida varauksen?</div><Confirmation execute={disableReservation} setShowConfirm={setShowDisableConfirm} /></> :
                <button className="disable-button" title="Arkistoimisen jälkeen et voi enää lainata varaukseen kuuluvia niteitä." onClick={handleDisableReservation} >Arkistoi</button>}
        </div>
    )
}

export default DisableReservation