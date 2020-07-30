import React from 'react'
import { useSelector } from 'react-redux'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import BlockIcon from '@material-ui/icons/Block'

const Message = () => {
    const reduxMessage = useSelector(state => state.message)
    const reduxErrorMessage = useSelector(state => state.errorMessage)

    if (reduxMessage) {
        return (
            <div id="overlay">
                <div id="message">
                    <CheckCircleIcon fontSize="large" /><br />
                    {reduxMessage}
                </div>
            </div>
        )
    } else if (reduxErrorMessage) {
        return (
            <div id="overlay">
                <div id="error">
                    <BlockIcon fontSize="large" /><br />
                    {reduxErrorMessage}
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default Message

