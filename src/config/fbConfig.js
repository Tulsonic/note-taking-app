import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: "note-taking-app-ab2f1.firebaseapp.com",
    databaseURL: "https://note-taking-app-ab2f1.firebaseio.com",
    projectId: "note-taking-app-ab2f1",
    storageBucket: "note-taking-app-ab2f1.appspot.com",
    messagingSenderId: "675635192322",
    appId: "1:675635192322:web:a92da921780439302c7d1b",
    measurementId: "G-JYDCC5XWKW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
