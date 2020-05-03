import React, { useState, useEffect } from 'react'
import Book from '../components/Book'

const Books = ({ books, book, handleChooseBook, borrowingBookForm, returnBook }) => {
    return (
        <>
            <p>Kirjat</p>
            {books.map((b) =>
                <div key={b.id}>
                    <Book key={b.id} book={b} />
                    <button onClick={() => handleChooseBook(b.id)}>{b.copy}</button>
                    <div>
                        {book && !b.loan && book.id === b.id ? borrowingBookForm() : null}
                        {book && b.loan && book.id === b.id ? returnBook() : null}
                    </div>
                </div>)}
        </>
    )
}

export default Books