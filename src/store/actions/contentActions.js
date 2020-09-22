import { reduxReactFirebase } from "react-redux-firebase";

export const createNotebook = notebook => {
    return async (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        var resp = await firestore
            .collection("users")
            .doc(auth.uid)
            .collection("notebooks")
            .add({
                name: notebook.name,
                favorite: false,
                favoriteAt: 0,
                createdAt: new Date(),
                modifiedAt: new Date(),
                subcollections: [{ collection: "notes" }]
            })
            .then(resp => {
                dispatch({ type: "CREATE_NOTEBOOK_SUCCESS", resp });
                return resp;
            })
            .catch(err => {
                dispatch({ type: "CREATE_NOTEBOOK_FAILED", err });
            });

        return resp;
    };
};

export const createNote = (notebookID, note) => {
    return async (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        var resp = await firestore
            .collection("users")
            .doc(auth.uid)
            .collection("notebooks")
            .doc(notebookID)
            .collection("notes")
            .add({
                name: note.name,
                content: "",
                createdAt: new Date()
            })
            .then(resp => {
                dispatch({ type: "CREATE_NOTE_SUCCESS", resp });
                return resp;
            })
            .catch(err => {
                dispatch({ type: "CREATE_NOTE_FAILED", err });
            });

        return resp;
    };
};

export const changeNotebookName = (notebookID, name) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        firestore
            .collection("users")
            .doc(auth.uid)
            .collection("notebooks")
            .doc(notebookID)
            .update({ name: name })
            .then(() => {
                dispatch({ type: "CHANGE_NOTEBOOK_NAME_SUCCESS" });
            })
            .catch(err => {
                dispatch({ type: "CHANGE_NOTEBOOK_NAME_FAILED" }, err);
            });
    };
};

export const changeNoteName = (notebookID, noteID, name) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        firestore
            .collection("users")
            .doc(auth.uid)
            .collection("notebooks")
            .doc(notebookID)
            .collection("notes")
            .doc(noteID)
            .update({ name: name })
            .then(resp => {
                dispatch({ type: "CHANGE_NOTE_NAME_SUCCESS", resp });
            })
            .catch(err => {
                dispatch({ type: "CHANGE_NOTE_NAME_FAILED", err });
            });
    };
};

export const deleteItem = (notebookID, noteID) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        if (noteID) {
            firestore
                .collection("users")
                .doc(auth.uid)
                .collection("notebooks")
                .doc(notebookID)
                .collection("notes")
                .doc(noteID)
                .delete()
                .then(resp => {
                    dispatch({ type: "DELETE_ITEM_SUCCESS", resp });
                })
                .catch(err => {
                    dispatch({ type: "DELETE_ITEM_FAILED", err });
                });
        } else {
            firestore
                .collection("users")
                .doc(auth.uid)
                .collection("notebooks")
                .doc(notebookID)
                .delete()
                .then(resp => {
                    dispatch({ type: "DELETE_ITEM_SUCCESS", resp });
                })
                .catch(err => {
                    dispatch({ type: "DELETE_ITEM_FAILED", err });
                });
        }
    };
};

export const favoriteNotebook = (notebookID, state) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        firestore
            .collection("users")
            .doc(auth.uid)
            .collection("notebooks")
            .doc(notebookID)
            .update({ favorite: state, favoriteAt: new Date() })
            .then(() => {
                dispatch({ type: "FAVORITE_SUCCESSFUL" });
            })
            .catch(err => {
                dispatch({ type: "FAVORITE_FAILED", err });
            });
    };
};

export const resetItemDeleted = () => {
    return dispatch => {
        dispatch({ type: "RESET_ITEM_DELETED" });
    };
};

export const updateModifiedAt = notebookID => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        firestore
            .collection("users")
            .doc(auth.uid)
            .collection("notebooks")
            .doc(notebookID)
            .update({ modifiedAt: new Date() })
            .then(() => {
                dispatch({ type: "UPDATE_MODIFIED_AT_SUCCESS" });
            })
            .catch(err => {
                dispatch({ type: "UPDATE_MODIFIED_AT_FAILED", err });
            });
    };
};

export const saveContent = (content, noteID, notebookID) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        firestore
            .collection("users")
            .doc(auth.uid)
            .collection("notebooks")
            .doc(notebookID)
            .collection("notes")
            .doc(noteID)
            .update({ content: content })
            .then(() => {
                dispatch({ type: "SAVE_CONTENT_SUCCESS" });
            })
            .catch(err => {
                dispatch({ type: "SAVE_CONTENT_FAILED", err });
            });
    };
};

export const createTodo = (content, value, noteID, notebookID) => {
    return async (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        var resp = firestore
            .collection("users")
            .doc(auth.uid)
            .collection("todos")
            .add({
                content: content,
                value: value,
                noteID: noteID,
                notebookID: notebookID,
                date: ""
            })
            .then(resp => {
                dispatch({ type: "CREATE_TODO_SUCCESS", resp });
                return resp;
            })
            .catch(err => {
                dispatch({ type: "CREATE_TODO_FAILED", err });
            });

        return resp;
    };
};

export const updateTodoContent = (content, todoID) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        firestore
            .collection("users")
            .doc(auth.uid)
            .collection("todos")
            .doc(todoID)
            .update({ content: content })
            .then(resp => {
                dispatch({ type: "TODO_CONTENT_UPDATE_SUCCESS", resp });
            })
            .catch(err => {
                dispatch({ type: "TODO_CONTENT_UPDATE_FAILED", err });
            });
    };
};

export const updateTodoValue = (value, todoID) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        firestore
            .collection("users")
            .doc(auth.uid)
            .collection("todos")
            .doc(todoID)
            .update({ value: value })
            .then(resp => {
                dispatch({ type: "TODO_VALUE_UPDATE_SUCCESS", resp });
            })
            .catch(err => {
                dispatch({ type: "TODO_VALUE_UPDATE_FAILED", err });
            });
    };
};

export const removeTodo = todoID => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = firebase.firestore();

        const auth = getState().firebase.auth;

        firestore
            .collection("users")
            .doc(auth.uid)
            .collection("todos")
            .doc(todoID)
            .delete()
            .then(resp => {
                dispatch({ type: "REMOVE_TODO_SUCCESS", resp });
            })
            .catch(err => {
                dispatch({ type: "REMOVE_TODO_FAILED", err });
            });
    };
};

export const deleteNotebookSignal = (notebookID, notebookName) => {
    return dispatch => {
        dispatch({
            type: "DELETE_NOTEBOOK_SIGNAL",
            notebook: notebookID,
            notebookName: notebookName
        });
    };
};

export const deleteNotebookSignalReset = () => {
    return dispatch => {
        dispatch({
            type: "DELETE_NOTEBOOK_SIGNAL_RESET"
        });
    };
};

export const addToHistory = link => {
    return dispatch => {
        dispatch({
            type: "ADD_TO_HISTORY",
            link: link
        });
    };
};

export const removeHistory = () => {
    return dispatch => {
        dispatch({
            type: "REMOVE_HISTORY"
        });
    };
};

export const resetHistory = () => {
    return dispatch => {
        dispatch({
            type: "RESET_HISTORY"
        });
    };
};
