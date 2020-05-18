import React from 'react'
import Book from '../components/Book'
import { ReturnBook } from '../components/ReturnBook'
import ChooseBook from '../components/ChooseBook'

const Books = ({ books, setBooks, book, setBook, borrowingBookForm, setMessage, setErrorMessage }) => {
    const returnBook = () => (
        <ReturnBook book={book} setBook={setBook} books={books} setBooks={setBooks} setMessage={setMessage} setErrorMessage={setErrorMessage} />
    )
    return (
        <ul id="books">
            {books.map((b) =>
                <li id="book" key={b.id}>
                    <Book key={b.id} book={b} />
                    <ChooseBook book={b} setBook={setBook} books={books} />

                    <div>
                        {book && !b.loan && book.id === b.id ? borrowingBookForm() : null}
                        {book && b.loan && book.id === b.id ? returnBook() : null}
                    </div>
                </li>)}
        </ul>
    )
}

export default Books