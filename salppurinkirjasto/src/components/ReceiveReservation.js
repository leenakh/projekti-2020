import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import bookService from '../services/books'
import reservationService from '../services/reservations'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'

const ReceiveReservation = ({ id, setBeginDate, setEndDate }) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const fetchReservedBooks = async (reservation) => {
        try {
            const search = `title=${reservation.book}&isbn=`
            const reservedBooks = await bookService.search(search)
            let rBooks = []
            for (let b of reservedBooks) {
                for (let r of b.reservations) {
                    if (r.id === id) {
                        rBooks = [...rBooks, b]
                    }
                }
            }
            return rBooks
        } catch (exception) {
            console.log('Pieleen meni :(')
        }
    }

    const handleReceive = async () => {
        const reservation = await reservationService.getOne(id)
        const booksToReceive = await fetchReservedBooks(reservation)
        dispatch(setSelectedBooks(booksToReceive))
        setBeginDate(reservation.beginDate)
        setEndDate(reservation.endDate)
        history.push("/lainaa")
    }

    return (
        <div>
            <button className="receive-button" onClick={handleReceive} >Lunasta</button>
        </div>
    )
}

export default ReceiveReservation