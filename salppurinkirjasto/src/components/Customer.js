import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import customerService from '../services/customers'
import { dateFormat } from '../components/DateFormat'
import { setBook } from '../reducers/bookReducer'
import { setSelectedBooks } from '../reducers/selectedBooksReducer'
import { getCustomersLoans } from '../reducers/loansReducer'
import { setCustomers } from '../reducers/customerInfoReducer'
import bookService from '../services/books'

const FetchCustomerForm = ({ customerName, setCustomerName }) => {
    const history = useHistory()
    const handleSubmitCustomer = (event) => {
        event.preventDefault()
        history.push(`/asiakas/${customerName}`)
    }

    return (
        <div className="customer-form-container">
            <form id="customer-form" onSubmit={handleSubmitCustomer}>
                <table>
                    <tbody>
                        <tr><td className="customer-form-cell">Asiakas</td><td><input type="text" placeholder="käyttäjätunnus" value={customerName} id="customer-name" onChange={({ target }) => setCustomerName(target.value)} /></td></tr>
                    </tbody>
                </table>
                <div className="button-container">
                    <button className="customer-button">Hae</button>
                </div>
            </form>
        </div>
    )
}

const ToggleLoans = ({ customerInfo, setCustomerInfo }) => {
    const [showAll, setShowAll] = useState(true)
    const [toggleText, setToggleText] = useState('Kaikki')
    const [titleText, setTitleText] = useState('Näytä kaikki lainat')
    const loans = useSelector(state => state.loans)

    const toggle = () => {
        setShowAll(!showAll)
        setToggleText(showAll === false ? 'Kaikki' : 'Palauttamattomat')
        setTitleText(showAll === false ? 'Näytä kaikki lainat' : 'Näytä vain palauttamattomat lainat')
        filterLoans()
    }

    const filterLoans = () => {
        if (showAll === false) {
            const filteredLoans = loans.filter(l => !l.returned)
            setCustomerInfo({ ...customerInfo, loans: filteredLoans })
        } else {
            setCustomerInfo({ ...customerInfo, loans: loans })
        }
    }

    return <button className="filter" onClick={toggle} title={titleText}>{toggleText}</button>
}

const Loan = ({ loan }) => {
    const history = useHistory()
    const dispatch = useDispatch()

    const returned = (value) => {
        if (value) {
            return 'Kyllä'
        } else {
            return 'Ei'
        }
    }

    const handleChooseBook = async (id) => {
        const chosenBook = await bookService.getOne(id)
        dispatch(setBook(chosenBook))
        dispatch(setSelectedBooks([chosenBook]))
        history.push(`/lainaa/${chosenBook.copy}`)
    }

    const style = () => {
        if (new Date().getTime() - new Date(loan.endDate).getTime() >= 86400000 && loan.returned === false) {
            return 'loan-cell-red'
        } else {
            return 'loan-cell-green'
        }
    }

    return (
        <table>
            <tbody>
                <tr><td className="loan-cell"><b>Nimeke</b></td><td className="loan-cell-title"><button title={loan.book.title} className="book-info" onClick={() => handleChooseBook(loan.book.id)}>{loan.book.title}</button></td><td className="loan-cell-copy"><b>Nide</b><span className="loan-cell-copy-number">{loan.book.copy}</span></td></tr>
                <tr><td className="loan-cell"><b>Lainattu</b></td><td className="loan-cell"><b>Palautuspäivä</b></td><td className="loan-cell"><b>Palautettu</b></td></tr>
                <tr><td className="loan-cell">{dateFormat(loan.beginDate)}</td><td className={style()}>{dateFormat(loan.endDate)}</td><td className={style()}>{returned(loan.returned)}</td></tr>
            </tbody>
        </table>
    )
}

const CustomerInfo = ({ customer, customerInfo, setCustomerInfo }) => {
    const dispatch = useDispatch()
    const customers = useSelector(state => state.customerInfo)

    useEffect(() => {
        const getCustomerInfo = async () => {
            try {
                const returnedCustomers = await customers.filter(c => c.username === customer)
                if (returnedCustomers !== null && returnedCustomers.length !== 0) {
                    const loans = await customerService.getLoans(customer)
                    dispatch(getCustomersLoans(customer))
                    const initialLoans = loans.filter(l => !l.returned)

                    setCustomerInfo({ info: returnedCustomers[0], loans: initialLoans })
                }
            } catch (exception) {
                console.log('Jotain meni pieleen.')
            }
        }
        getCustomerInfo()
    }, [customer])

    const access = (value) => {
        if (value) {
            return 'Ei lainauskieltoa'
        } else {
            return 'Lainauskielto'
        }
    }

    const style = (loan) => {
        if (new Date().getTime() - new Date(loan.endDate).getTime() >= 86400000 && loan.returned === false) {
            return 'loan-red'
        } else {
            return 'loan-green'
        }
    }


    if (customerInfo) {
        return (
            <div className="customer-info">
                <table>
                    <tbody>
                        <tr><td className="customer-info-cell"><b>Asiakastunnus</b></td><td className="customer-info-cell">{customerInfo.info.username}</td></tr>
                        <tr><td className="customer-info-cell"><b>Käyttöoikeus</b></td><td className="customer-info-cell">{access(customerInfo.info.accessAllowed)}</td><td><SetAccess customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} /></td></tr>
                        <tr><td className="customer-info-cell"><b>Lainat</b></td></tr>
                    </tbody>
                </table>
                <div className="loan-info">
                    <ul>
                        <ToggleLoans customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />
                        {customerInfo.loans.map(loan =>
                            <li key={loan.id} className={style(loan)}><Loan loan={loan} /></li>)}
                    </ul>
                </div>
            </div>
        )
    } else {
        return null
    }
}

const SetAccess = ({ customerInfo, setCustomerInfo }) => {
    const dispatch = useDispatch()
    const customers = useSelector(state => state.customerInfo)
    const [accessText, setAccessText] = useState('')

    useEffect(() => {
        const access = () => {
            if (customerInfo.info.accessAllowed) {
                setAccessText('Aseta')
            } else {
                setAccessText('Poista')
            }
        }
        access()
    }, [customerInfo])

    const handleSetAccess = async (value) => {
        const changedCustomer = { ...customerInfo.info, accessAllowed: value }
        const returnedCustomer = await customerService.update(customerInfo.info.username, changedCustomer)
        const changedCustomers = await customers.map(c => c.username === returnedCustomer.username ? returnedCustomer : c)
        setCustomerInfo({ ...customerInfo, info: returnedCustomer })
        dispatch(setCustomers(changedCustomers))
    }
    return (
        <button className="set-access-button" title="Aseta tai poista lainauskielto tilapäisesti" onClick={() => handleSetAccess(!customerInfo.info.accessAllowed)}>{accessText}</button>
    )
}

const Customer = () => {
    const [customerInfo, setCustomerInfo] = useState(null)
    const [customerName, setCustomerName] = useState('')
    const customer = useParams().id

    return (
        <div>
            <FetchCustomerForm customerName={customerName} setCustomerName={setCustomerName} />
            <CustomerInfo customer={customer} customerName={customerName} customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />
        </div>
    )
}

export default Customer