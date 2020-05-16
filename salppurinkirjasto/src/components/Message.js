import React from 'react'

const Message = ({ message, errorMessage }) => {

    if (message) {
        return (
            <div id="message">
                {message}
            </div>
        )
    } else if (errorMessage) {
        return (
            <div id="error">
                {errorMessage}
            </div>
        )
    } else {
        return null
    }
}

export default Message

