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
            console.log('search', reservation.book)
            const search = `title=${reservation.book}&isbn=`
            const reservedBooks = await bookService.search(search)
            let rBooks = []
            for (let b of reservedBooks) {
                console.log('b', b)
                for (let r of b.reservations) {
                    console.log('r', r.id)
                    console.log('id', id)
                    if (r.id === id) {
                        console.log('b', b)
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
                <button onClick={handleReceive} >Lunasta varaus</button>
            </div>
        )
}

export default ReceiveReservation