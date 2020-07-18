import React from 'react'

export const dateFormat = (date) => {
    const parts = date.split('-')
    const dateString = `${parts[2]}.${parts[1]}.${parts[0]}`
    return dateString
}

const DateFormat = ({date}) => {
    const formatted = dateFormat(date)
    return (
        <div>
            {formatted}
        </div>
    )
}

export default DateFormat