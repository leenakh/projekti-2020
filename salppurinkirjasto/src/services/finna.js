import axios from 'axios'
const finna = 'https://api.finna.fi/v1/search?lookfor='
//&field[]=title&field[]=authors&field[]=languages'

const getOne = async (isbn) => {
    const response = await axios.get(`${finna}${isbn}`)
    return response.data
}

export default {
    getOne
}