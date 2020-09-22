const initialState = {
    documentContent: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_CONTENT":
            return {
                documentContent: action.content
            };
        default:
            return state;
    }
};
