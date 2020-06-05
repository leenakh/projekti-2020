import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Book from '../components/Book'
import { ReturnBook } from '../components/ReturnBook'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import ChooseBook from '../components/ChooseBook'

const Books = ({ borrowingBookForm }) => {
    const selectedBooks = useSelector(state => state.selectedBooks)
    const dispatch = useDispatch()
    const book = useSelector(state => state.book)
    if (selectedBooks) {
        return (
            <ul id="books">
                {selectedBooks.map((b) =>
                    <li id="book" key={b.id}>
                        <Book key={b.id} book={b} />
                        <ChooseBook book={b} />

                        <div>
                            {book && !b.loan && book.id === b.id ? borrowingBookForm() : null}
                            {book && b.loan && book.id === b.id ? <ReturnBook /> : null}
                        </div>
                    </li>)}
            </ul>
        )
    }
    return null
}

export default Books