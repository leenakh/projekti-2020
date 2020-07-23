import React from 'react'

const Confirmation = ({ execute, setShowConfirm, setShowInfo }) => {

    const handleConfirmation = (value) => {
        if (value === true) {
            execute()
        } else {
            console.log('Eiku')
        }
        setShowConfirm(false)
        setShowInfo(false)
    }

    return (
        <div>
            <button id="confirmation" onClick={() => handleConfirmation(true)}>Vahvista</button>
            <button id="cancel" onClick={() => handleConfirmation(false)}>Peruuta</button>
        </div>
    )
}

export default Confirmation