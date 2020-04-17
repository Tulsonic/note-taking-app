export const noNotes = () => {
    return (dispatch) => {
        dispatch({ type: "NO_NOTES" });
    };
};

export const resetNoNotes = () => {
    return (dispatch) => {
        dispatch({ type: "RESET_NO_NOTES" });
    };
};
