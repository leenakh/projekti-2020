import React from 'react'

export const dateFormat = (date) => {
    const parts = date.split('-')
    const format = (part) => {
        if (part.startsWith('0')) {
            return part.substring(1, 2)
        } else {
            return part
        }
    }

    const dateString = `${format(parts[2])}.${format(parts[1])}.${parts[0]}`
    return dateString
}

export const dateFormatReverse = (date) => {
    const parts = date.split('.')
    const format = (part) => {
        if (!part.startsWith('0') && part.length === 1) {
            return `0${part}`
        } else {
            return part
        }
    }
    const dateString = `${format(parts[2])}-${format(parts[1])}-${format(parts[0])}`
    return dateString
}

const DateFormat = ({ date }) => {
    const formatted = dateFormat(date)
    return (
        <div>
            {formatted}
        </div>
    )
}

export default DateFormat