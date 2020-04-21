import axios from 'axios'
const baseUrl = 'https://api.finna.fi/v1/search?lookfor=9789511314318'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

export default { getAll }