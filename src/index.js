import React from "react";
import ReactDOM from "react-dom";
import "./style/css/index.css";
import "./style/fonts/arkipelago/stylesheet.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Redux
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./store/reducers/rootReducer";
import { Provider, useSelector } from "react-redux";
import thunk from "redux-thunk";

// Firebase
import firebase from "./config/fbConfig";
import {
    ReactReduxFirebaseProvider,
    getFirebase,
    isLoaded,
} from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";

const store = createStore(
    rootReducer,
    compose(applyMiddleware(thunk.withExtraArgument({ getFirebase })))
);

const rrfConfig = {
    userProfile: "users",
    useFirestoreForProfile: true,
};

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,
};

function AuthIsLoaded({ children }) {
    const auth = useSelector((state) => state.firebase.auth);
    if (!isLoaded(auth)) return null;
    return children;
}

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <AuthIsLoaded>
                    <App />
                </AuthIsLoaded>
            </ReactReduxFirebaseProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
