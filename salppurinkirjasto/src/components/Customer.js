import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import customerService from '../services/customers'
import { dateFormat } from '../components/DateFormat'

const FetchCustomerForm = ({ setCustomerInfo }) => {
    const history = useHistory()
    const [customerName, setCustomerName] = useState('')

    const handleSetCustomerInfo = async (event) => {
        event.preventDefault()
        let customer = null
        try {
            const returnedCustomers = await customerService.search(customerName)
            if (returnedCustomers !== null && returnedCustomers.length !== 0) {
                const loans = await customerService.getLoans(customerName)
                const initialLoans = loans.filter(l => !l.returned)
                customer = { info: returnedCustomers[0], loans: initialLoans }
                setCustomerInfo(customer)
                history.push(`/asiakas/${customerName}`)
            }
        } catch (exception) {
            console.log('Jotain meni pieleen.')
        }
    }

    return (
        <form id="customer-form" onSubmit={handleSetCustomerInfo}>
            <div>
                Asiakas: <input type="text" value={customerName} id="customer-name" onChange={({ target }) => setCustomerName(target.value)} />
            </div>
            <div>
                <button id="customer-button">Lähetä</button>
            </div>
        </form>
    )
}

const ToggleLoans = ({ customerInfo, setCustomerInfo }) => {
    const [showAll, setShowAll] = useState(true)
    const [toggleText, setToggleText] = useState('Näytä kaikki lainat')
    const [loans, setLoans] = useState([])

    useEffect(() => {
        const getLoans = async () => {
            const loans = await customerService.getLoans(customerInfo.info.username)
            setLoans(loans)
        }
        getLoans()
    }, [])

    const toggle = () => {
        setShowAll(!showAll)
        setToggleText(showAll === false ? 'Näytä kaikki lainat' : 'Näytä palauttamattomat lainat')
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

    return <button onClick={toggle}>{toggleText}</button>
}

const Loan = ({ loan }) => {
    const returned = (value) => {
        if (value) {
            return 'Kyllä'
        } else {
            return 'Ei'
        }
    }

    return (
        <table>
            <tbody>
                <tr><td className="loan-cell"><b>Kirja</b></td><td className="loan-cell-title">{loan.book.title}</td></tr>
                <tr><td className="loan-cell"><b>Lainattu</b></td><td className="loan-cell"><b>Palautuspäivä</b></td><td className="loan-cell"><b>Palautettu</b></td></tr>
                <tr><td className="loan-cell">{dateFormat(loan.beginDate)}</td><td className="loan-cell">{dateFormat(loan.endDate)}</td><td className="loan-cell">{returned(loan.returned)}</td></tr>
            </tbody>
        </table>
    )
}

const CustomerInfo = ({ customerInfo, setCustomerInfo }) => {
    const access = (value) => {
        if (value) {
            return 'Ei lainauskieltoa'
        } else {
            return 'Lainauskielto'
        }
    }

    if (customerInfo) {
        return (
            <div className="customer-info">
                <ul>
                    <li><b>Käyttäjätunnus:</b> {customerInfo.info.username}</li>
                    <li><b>Käyttöoikeus:</b> {access(customerInfo.info.accessAllowed)}<SetAccess customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} /></li>
                    <li><b>Lainat: </b></li>
                    <div className="loan-info">
                        <ToggleLoans customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />
                        {customerInfo.loans.map(loan =>
                            <li key={loan.id}><Loan loan={loan} /></li>)}
                    </div>
                </ul>
            </div>
        )
    }
}

const SetAccess = ({ customerInfo, setCustomerInfo }) => {
    const [accessText, setAccessText] = useState('')

    useEffect(() => {
        const access = () => {
            if (customerInfo.info.accessAllowed) {
                setAccessText('Aseta lainauskielto')
            } else {
                setAccessText('Poista lainauskielto')
            }
        }
        access()
    }, [customerInfo])

    const handleSetAccess = async (value) => {
        const changedCustomer = { ...customerInfo.info, accessAllowed: value }
        const returnedCustomer = await customerService.update(customerInfo.info.username, changedCustomer)
        setCustomerInfo({ ...customerInfo, info: returnedCustomer })
        console.log('customerInfo', customerInfo)
    }
    return (
    <button onClick={() => handleSetAccess(!customerInfo.info.accessAllowed)}>{accessText}</button>
    )
}

const Customer = () => {
    const [customerInfo, setCustomerInfo] = useState(null)

    return (
        <div>
            <FetchCustomerForm setCustomerInfo={setCustomerInfo} />
            {customerInfo !== null ? <CustomerInfo customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} /> : null}
        </div>
    )
}

export default Customer