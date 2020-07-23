import React, { useState } from 'react'
import { dateFormat } from '../components/DateFormat'

const Book = ({ book }) => {
    const [showInfo, setShowInfo] = useState(false)

    const toggleShowInfo = () => {
        setShowInfo(!showInfo)
    }

    return (
        <div className="book">
            <ul>
                <li>
                    <button className="book-info" onClick={toggleShowInfo} ><div className="title">{book.title}</div></button>
                </li>
                {showInfo ?
                    <div className="authors">
                        <ul>
                            <li><b>Kirjoittajat</b></li>
                            {book.authors.map(a =>
                                <li key={a.name}>{a.name}</li>)}
                            <li><b>Julkaisuvuosi</b></li>
                            <li>{book.published}</li>
                        </ul>
                    </div> : null
                }

                {showInfo && book.loan ?
                    <div className="loan-info">
                        <ul>
                            <li><b>Lainaustiedot</b></li>
                            <li>Asiakas: {book.loan.customer}</li>
                            <li>Lainattu: {dateFormat(book.loan.beginDate)}</li>
                            <li>Palautettava: {dateFormat(book.loan.endDate)}</li>
                        </ul>
                    </div> : null
                }
            </ul>

        </div>
    )
}

export default Book