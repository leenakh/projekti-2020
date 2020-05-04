import React from 'react'

const ChooseBook = ({ book, setBook, books, setErrorMessage }) => {
    const handleChooseBook = async (id) => {
        console.log(id)
        try {
            const chosenBook = books.find(b => b.id === id)
            setBook(chosenBook)
        } catch (exception) {
            console.log(exception)
            setErrorMessage('Kirjaa ei löytynyt.')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }
    return (
        <button onClick={() => handleChooseBook(book.id)}>{book.copy}</button>
    )
}

export default ChooseBook
