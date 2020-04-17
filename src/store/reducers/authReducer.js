const initialState = {
    authError: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            console.log("login successfull");
            return { ...state, authError: null };
        case "LOGIN_FAILED":
            console.log("login failed");
            return { ...state, authError: action.err };
        case "SIGNUP_SUCCESS":
            console.log("signup successfull");
            return { ...state, authError: null };
        case "SIGNUP_FAILED":
            console.log("signup failed");
            return { ...state, authError: action.err };
        case "LOGOUT_SUCCESS":
            console.log("logged out successfully");
            return { state: state, authError: null };
        case "LOGOUT_FAILED":
            console.log("log out failed");
            return { state: state, authError: action.err };
        default:
            return state;
    }
};
