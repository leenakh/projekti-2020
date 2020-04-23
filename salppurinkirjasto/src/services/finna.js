import axios from 'axios'
const finna = 'https://api.finna.fi/v1/search?lookfor=9789511314318'
//&field[]=title&field[]=authors&field[]=languages'

const getAll = () => {
    const request = axios.get(finna)
    return request.then(response => response.data)
}

export default {
    getAll
}