const initialState = {
    noNotes: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "NO_NOTES":
            //console.log("no notes found");
            return { ...state, noNotes: true };

        case "RESET_NO_NOTES":
            //console.log("found notes ");
            return { ...state, noNotes: false };

        default:
            return state;
    }
};
