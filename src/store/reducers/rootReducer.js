import authReducer from "./authReducer";
import contentReducer from "./contentReducer";
import communicationReducer from "./communicationReducer";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import { combineReducers } from "redux";

export default combineReducers({
    auth: authReducer,
    content: contentReducer,
    communication: communicationReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});
