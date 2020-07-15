import React, { useState } from 'react'

const Book = ({ book }) => {
    const [showInfo, setShowInfo] = useState(false)

    const toggleShowInfo = () => {
        setShowInfo(!showInfo)
    }

    const formatDate = (date) => {
        const parts = date.split('-')
        const dateString = `${parts[2]}.${parts[1]}.${parts[0]}`
        return dateString
    }

    return (
        <div className="book">
            <ul>
                <li>
                    <button className="book-info" onClick={toggleShowInfo} >{book.title}</button>
                </li>
                {showInfo ?
                    <div className="authors">
                        <ul>
                            <li><b>Kirjoittajat</b></li>
                            {book.authors.map(a =>
                                <li key={a.name}>{a.name}</li>)}
                        </ul>
                    </div> : null
                }

                {showInfo && book.loan ?
                    <div className="loan-info">
                        <ul>
                            <li><b>Lainaustiedot</b></li>
                            <li>Asiakas: {book.loan.customer}</li>
                            <li>Lainattu: {formatDate(book.loan.beginDate)}</li>
                            <li>Palautettava: {formatDate(book.loan.endDate)}</li>
                        </ul>
                    </div> : null
                }
            </ul>

        </div>
    )
}

export default Book