import React, { useState, useEffect} from 'react'

const Kissa = ({nimi, ika}) => {

    return (
        <div>
            <p>
                Kissan nimi on {nimi} ja ikä {ika} vuotta.
            </p>
        </div>
    )
}

export default Kissa