import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import bookService from '../services/books'
import reservationService from '../services/reservations'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import { setBook } from '../reducers/bookReducer'
import { removalOfReservationFromBook } from '../components/RemoveReservation'
import { removalOfCalendarEntry } from '../components/RemoveReservation'

const ReceiveReservation = ({ id, setShowBorrow }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const books = useSelector(state => state.books)
    const selectedBooks = useSelector(state => state.selectedBooks)
    //const [reservation, setReservation] = useState(null)
    const [hideDisable, setHideDisable] = useState(false)

    /* useEffect(() => {
        const getReservation = async () => {
            const r = await reservationService.getOne(id)
            setReservation(r)
        }
        getReservation()
    }, []) */

    /* const lunastaVaraus = () => {
        hae kaikki varaukseen kuuluvat niteet ja aseta ne tilaan (selectedBooks)
        esitä käyttäjälle lainauslomake
        poista varaus jokaiselta lainattavalta kirjalta
        muuta varauksen kentän received arvoksi true, kun käyttäjä on lainannut haluamansa määrän kirjoja
    } */
    const fetchReservedBooks = async () => {
        try {
            const reservation = await reservationService.getOne(id)
            console.log('search', reservation.book)
            const search = `title=${reservation.book}&isbn=`
            const reservedBooks = await bookService.search(search)
            //console.log('books', reservedBooks)
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
            //console.log('reservedBooks', rBooks)
            return rBooks
        } catch (exception) {
            console.log('Pieleen meni :(')
        }
    }

    const handleReceive = async () => {
        const booksToReceive = await fetchReservedBooks()
        //console.log('booksToReceive', booksToReceive)
        dispatch(setSelectedBooks(booksToReceive))
        //setShowBorrow(id)
        //dispatch(setBook(booksToReceive[0]))
        history.push("/lainaa")
    }

        return (
            <div>
                <button onClick={handleReceive} >Lunasta varaus</button>
            </div>
        )
}

export default ReceiveReservation