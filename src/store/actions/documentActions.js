export const updateContent = content => {
    return dispatch => {
        dispatch({type: "UPDATE_CONTENT", content: content})
    }
}
