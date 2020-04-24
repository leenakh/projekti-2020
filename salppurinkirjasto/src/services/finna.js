import axios from 'axios'
const finna = 'https://api.finna.fi/v1/search?lookfor='
//&field[]=title&field[]=authors&field[]=languages'

const getOne = (isbn) => {
    const request = axios.get(`${finna}${isbn}`)
    return request.then(response => response.data)
}

export default {
    getOne
}