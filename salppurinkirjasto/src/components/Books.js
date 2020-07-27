import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Book from '../components/Book'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'

const Books = ({ borrowingBookForm }) => {
    const selectedBooks = useSelector(state => state.selectedBooks)
    const dispatch = useDispatch()
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
        let title = ''
        if (filter === 'ALL') {
            text = 'Lainattavissa'
            title = 'Näytä vain lainattavissa olevat kirjat'
        }
        else if (filter === 'FILTERED') {
            text = 'Kaikki'
            title = 'Näytä kaikki kirjat'
        }
        return (
            <button className="filter" onClick={handleFilterBooks} title={title} >{text}</button>
        )
    }

    if (selectedBooks) {
        return (
            <div className="books-container">
                <FilterBooks />
                <ul className="books">
                    {selectedBooks.map((b) =>
                        <li className="book" key={b.id}>
                            <Book className="book" key={b.id} currentBook={b} borrowingBookForm={borrowingBookForm} />
                        </li>)}
                </ul>
            </div>
        )
    }
    return null
}

export default Books