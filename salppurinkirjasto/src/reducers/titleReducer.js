export const titleReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_TITLE':
            return action.data
        default:
            return state
    }
}

export const setTitle = (title) => {
    return {
        type: 'SET_TITLE',
        data: title
    }
}

export default titleReducer