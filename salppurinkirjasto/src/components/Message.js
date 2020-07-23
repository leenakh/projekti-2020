import React from 'react'
import { useSelector } from 'react-redux'

const Message = () => {
    const reduxMessage = useSelector(state => state.message)
    const reduxErrorMessage = useSelector(state => state.errorMessage)

    if (reduxMessage) {
        return (
            <div id="overlay">
                <div id="message">
                    {reduxMessage}
                </div>
            </div>
        )
    } else if (reduxErrorMessage) {
        return (
            <div id="overlay">
                <div id="error">
                    {reduxErrorMessage}
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default Message

