import React from 'react'

const Message = ({ message, errorMessage }) => {

    if (message) {
        return (
            <div>
                {message}
            </div>
        )
    } else if (errorMessage) {
        return (
            <div>
                {errorMessage}
            </div>
        )
    } else {
        return null
    }
}

export default Message
