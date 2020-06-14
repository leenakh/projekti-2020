import React from 'react'

const Confirmation = ({ execute, setShowConfirm, info }) => {

    const handleConfirmation = (value) => {
        if (value === true) {
            execute()
        } else {
            setShowConfirm(false)
            console.log('Eiku')
        }
    }

    return (
        <div>
            {info}
            <button id="confirmation" onClick={() => handleConfirmation(true)}>Vahvista</button>
            <button id="cancel" onClick={() => handleConfirmation(false)}>Peruuta</button>
        </div>
    )
}

export default Confirmation