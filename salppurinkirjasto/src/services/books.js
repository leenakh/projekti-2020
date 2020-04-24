import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/books'
const finna = 'https://api.finna.fi/v1/search?lookfor=9789511314318&field[]=title&field[]=authors&field[]=languages'

let token = null
const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newObject) => {

    const config = {
        headers: { Authorization: token }
    }

    const request = axios.post(baseUrl, newObject, config)
    return request.then(response => response.data)
}

export default {
    getAll,
    create,
    setToken
}