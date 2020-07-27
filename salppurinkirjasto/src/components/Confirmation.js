import React from 'react'

const Confirmation = ({ execute, setShowConfirm, setShowInfo }) => {

    const handleConfirmation = (value) => {
        if (value === true) {
            execute()
        }
        setShowConfirm(false)
        setShowInfo(false)
    }

    return (
        <div>
            <button className="confirm" onClick={() => handleConfirmation(true)}>Vahvista</button>
            <button className="cancel" onClick={() => handleConfirmation(false)}>Peruuta</button>
        </div>
    )
}

export default Confirmation