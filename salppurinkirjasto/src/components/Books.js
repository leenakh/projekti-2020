import React from 'react'
import {useSelector} from 'react-redux'
import Book from '../components/Book'
import { ReturnBook } from '../components/ReturnBook'
import ChooseBook from '../components/ChooseBook'

const Books = ({ borrowingBookForm }) => {
    const books = useSelector(state => state.books)
    const book = useSelector(state => state.book)
    const returnBook = () => (
        <ReturnBook />
    )
    return (
        <ul id="books">
            {books.map((b) =>
                <li id="book" key={b.id}>
                    <Book key={b.id} book={b} />
                    <ChooseBook book={b} />

                    <div>
                        {book && !b.loan && book.id === b.id ? borrowingBookForm() : null}
                        {book && b.loan && book.id === b.id ? returnBook() : null}
                    </div>
                </li>)}
        </ul>
    )
}

export default Books