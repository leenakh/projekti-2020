import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Book from '../components/Book'
import { ReturnBook } from '../components/ReturnBook'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import ChooseBook from '../components/ChooseBook'

const Books = ({ borrowingBookForm }) => {
    const selectedBooks = useSelector(state => state.selectedBooks)
    const dispatch = useDispatch()
    const book = useSelector(state => state.book)
    const [filter, setFilter] = useState('ALL')
    const [books] = useState(selectedBooks)

    const handleFilterBooks = () => {
        if (filter === 'ALL') {
            dispatch(setSelectedBooks(selectedBooks.filter(b => b.loan === null || b.loan === undefined)))
            setFilter('FILTERED')
        }
        else if (filter === 'FILTERED') {
            dispatch(setSelectedBooks(books))
            setFilter('ALL')
        }
    }

    const FilterBooks = () => {
        let text = ''
        if (filter === 'ALL') {
            text = 'Näytä vain lainattavissa olevat kirjat'
        }
        else if (filter === 'FILTERED') {
            text = 'Näytä kaikki kirjat'
        }
        return (
            <button onClick={handleFilterBooks} >{text}</button>
        )
    }

    if (selectedBooks) {
        return (
            <>
                <FilterBooks />
                <ul id="books">
                    {selectedBooks.map((b) =>
                        <li id="book" key={b.id}>
                            <div className="book-container">
                                <ChooseBook className="choose-book" book={b} /><Book className="book" key={b.id} book={b} />
                            </div>
                            <div>
                                {book && !b.loan && book.id === b.id ? borrowingBookForm() : null}
                                {book && b.loan && book.id === b.id ? <ReturnBook /> : null}
                            </div>
                        </li>)}
                </ul>
            </>
        )
    }
    return null
}

export default Books