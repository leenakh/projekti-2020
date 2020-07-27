import React, { useState } from 'react'
import { dateFormat } from '../components/DateFormat'
import ChooseBook from '../components/ChooseBook'
import ReturnBook from '../components/ReturnBook'
import { useSelector } from 'react-redux'

const Book = ({ currentBook, borrowingBookForm }) => {
  const [showInfo, setShowInfo] = useState(false)
  const book = useSelector(state => state.book)

  return (
    <div className="book">
      <ul className="book-title-container">
        <li className="book-title-container">
          <div className="book-title-container">
            <div className="book-copy" book={currentBook} >{currentBook.copy}</div><ChooseBook className="choose-book" book={currentBook} showInfo={showInfo} setShowInfo={setShowInfo} />
          </div>
        </li>
      </ul>
      {showInfo ?
        <>
          {currentBook.loan && book && currentBook.id === book.id ?
            <div className="loan-info-container">
              <table >
                <tbody>
                  <tr><td className="loan-info-cell">Asiakas</td><td>{currentBook.loan.customer}</td></tr>
                  <tr><td className="loan-info-cell">Lainattu</td><td>{dateFormat(currentBook.loan.beginDate)}</td></tr>
                  <tr><td className="loan-info-cell">Palautettava</td><td>{dateFormat(currentBook.loan.endDate)}</td></tr>
                </tbody>
              </table>
              <div className="button-container">
                <ReturnBook book={currentBook} />
              </div>
            </div> : null
          }
          <div>
            {book && !currentBook.loan && book.id === currentBook.id ? borrowingBookForm() : null}
          </div>
        </> : null}


    </div>
  )
}

export default Book