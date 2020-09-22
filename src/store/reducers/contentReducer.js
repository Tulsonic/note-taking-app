const initialState = {
    itemDeleted: false,
    deletingNotebookID: null,
    deletingNotebookName: null,
    historyArray: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_NOTEBOOK_SUCCESS":
            console.log("create notebook success");
            return { ...state };
        case "CREATE_NOTEBOOK_FAILED":
            console.log("create notebook failed");
            console.log(action.err);
            return { ...state };
        case "CREATE_NOTE_SUCCESS":
            console.log("create note success");
            return { ...state };
        case "CREATE_NOTE_FAILED":
            console.log("create note failed");
            console.log(action.err);
            return { ...state };
        case "CHANGE_NOTE_TITLE_SUCCESS":
            console.log("changed note title");
            return { ...state };
        case "CHANGE_NOTE_TITLE_FAILED":
            console.log("failed to change note title");
            return { ...state };
        case "CHANE_NOTEBOOK_NAME_SUCCESS":
            console.log("changed note name successfuly");
            return { ...state };
        case "CHANGE_NOTEBOOK_TITLE_FAILED":
            console.log("change notebook name failed");
            console.log(action.err);
            return { ...state };
        case "DELETE_ITEM_SUCCESS":
            console.log("item deleted successfully");
            return {
                ...state,
                itemDeleted: true,
                deletingNotebookID: null,
                deletingNotebookName: null
            };
        case "DELETE_ITEM_FAILED":
            console.log("item deletion failed");
            console.log(action.err);
            return { ...state };
        case "RESET_ITEM_DELETED":
            console.log("item deleted reset");
            return { ...state, itemDeleted: false };
        case "UPDATE_MODIFIED_AT_SUCCESS":
            console.log("modifiedAt update successful");
            return { ...state };
        case "UPDATE_MODIFIED_AT_FAILED":
            console.log("modifiedAt update failed");
            console.log(action.err);
            return { ...state };
        case "SAVE_CONTENT_SUCCESS":
            console.log("saved content successfully");
            return { ...state };
        case "SAVE_CONTENT_FAILED":
            console.log("failed to save content");
            console.log(action.error);
            return { ...state };
        case "DELETE_NOTEBOOK_SIGNAL":
            return {
                ...state,
                deletingNotebookID: action.notebook,
                deletingNotebookName: action.notebookName
            };
        case "DELETE_NOTEBOOK_SIGNAL_RESET":
            return {
                ...state,
                deletingNotebookID: null,
                deletingNotebookName: null
            };
        case "ADD_TO_HISTORY":
            return {
                ...state,
                historyArray: state.historyArray.concat(action.link)
            };
        case "REMOVE_HISTORY":
            let arr = state.historyArray;
            arr.pop();
            return {
                ...state,
                historyArray: arr
            };
        case "RESET_HISTORY":
            return {
                ...state,
                historyArray: []
            };
        case "CREATE_TODO_SUCCESS":
            return { ...state };
        case "CREATE_TODO_FAILED":
            return { ...state };
        case "TODO_CONTENT_UPDATE_SUCCESS":
            //console.log("success");
            return { ...state };
        case "TODO_CONTENT_UPDATE_FAILED":
            //console.log("faied", action.err);
            return { ...state };
        case "TODO_VALUE_UPDATE_SUCCESS":
            return { ...state };
        case "TODO_VALUE_UPDATE_FAILED":
            return { ...state };
        default:
            return state;
    }
};
