import React from 'react'
import { useSelector } from 'react-redux'

const Message = () => {
    const reduxMessage = useSelector(state => state.message)
    const reduxErrorMessage = useSelector(state => state.errorMessage)

    if (reduxMessage) {
        return (
            <div id="message">
                {reduxMessage}
            </div>
        )
    } else if (reduxErrorMessage) {
        return (
            <div id="error">
                {reduxErrorMessage}
            </div>
        )
    } else {
        return null
    }
}

export default Message

