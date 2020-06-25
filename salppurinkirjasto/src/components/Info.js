import React, { useState, useEffect } from 'react'

const Info = ({ information }) => {
    return (
        <div>
            <table>
                <tbody>
                    {information.map(i =>
                            <tr key={i.propertyName}><td><b>{i.propertyName}</b></td><td>{i.propertyValue}</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Info