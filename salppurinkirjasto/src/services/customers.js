import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/customers'

let token = null
const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getOne = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

const search = async (id) => {
    const response = await axios.get(`${baseUrl}/search/${id}`)
    return response.data
}

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = async (id, newObject) => {
    const config = {
        headers: {Authorization: token}
    }
    const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
    return response.data
}

export default {
    getAll,
    getOne,
    search,
    create,
    update,
    setToken
}