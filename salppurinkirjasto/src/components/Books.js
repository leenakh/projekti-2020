import React from 'react'
import Book from '../components/Book'
import ReturnBook from '../components/ReturnBook'
import ChooseBook from '../components/ChooseBook'

const Books = ({ books, setBooks, book, setBook, borrowingBookForm, setErrorMessage }) => {
    const returnBook = () => (
        <ReturnBook book={book} setBook={setBook} books={books} setBooks={setBooks} />
    )
    return (
        <>
            {books.map((b) =>
                <div key={b.id}>
                    <Book key={b.id} book={b} />
                    <ChooseBook book={b} setBook={setBook} books={books} />

                    <div>
                        {book && !b.loan && book.id === b.id ? borrowingBookForm() : null}
                        {book && b.loan && book.id === b.id ? returnBook() : null}
                    </div>
                </div>)}
        </>
    )
}

export default Books