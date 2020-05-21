export const copyReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_COPY':
            return action.data
        default:
            return state
    }
}

export const setCopy = (copy) => {
    return {
        type: 'SET_COPY',
        data: copy
    }
}

export default copyReducer