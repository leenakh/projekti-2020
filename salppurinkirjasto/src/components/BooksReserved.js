import React from 'react'
import { useSelector } from 'react-redux'
import Book from '../components/Book'

const BooksReserved = ({ borrowingBookForm }) => {
    const selectedBooks = useSelector(state => state.selectedBooks)

    if (selectedBooks) {
        return (
            <div className="books-container">
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

export default BooksReserved