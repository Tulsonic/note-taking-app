import authReducer from "./authReducer";
import contentReducer from "./contentReducer";
import communicationReducer from "./communicationReducer";
import documentReducer from "./documentReducer";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import { combineReducers } from "redux";
import undoable from "redux-undo";

export default combineReducers({
    auth: authReducer,
    content: contentReducer,
    communication: communicationReducer,
    document: undoable(documentReducer),
    firestore: firestoreReducer,
    firebase: firebaseReducer
});
