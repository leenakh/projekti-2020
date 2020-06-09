import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/books'

let token = null
const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const search = async (search) => {
    const response = await axios.get(`${baseUrl}/search/${search}`)
    return response.data
}

const getOne = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

const getLoans = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}/loans`)
    return response.data
}

const getAvailability = async (data) => {
    const response = await axios.post(`${baseUrl}/availability`, data)
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
    search,
    getOne,
    getLoans,
    getAvailability,
    create,
    update,
    setToken
}