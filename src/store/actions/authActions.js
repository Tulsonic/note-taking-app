export const logIn = (creds) => (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
        .auth()
        .signInWithEmailAndPassword(creds.email, creds.password)
        .then(() => {
            dispatch({ type: "LOGIN_SUCCESS" });
        })
        .catch((err) => {
            dispatch({ type: "LOGIN_FAILED", err });
        });
};

export const signUp = (newUser) => (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then((res) => {
            return firestore
                .collection("users")
                .doc(res.user.uid)
                .set({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    initials: (
                        newUser.firstName[0] + newUser.lastName[0]
                    ).toUpperCase(),
                });
        })
        .then(() => {
            dispatch({ type: "SIGNUP_SUCCESS" });
        })
        .catch((err) => {
            dispatch({ type: "SIGNUP_FAILED", err });
        });
};

export const logOut = () => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();

        firebase
            .auth()
            .signOut()
            .then(() => {
                dispatch({ type: "LOGOUT_SUCCESS" });
            })
            .catch((err) => {
                dispatch({ type: "LOGOUT_FAILED", err });
            });
    };
};
