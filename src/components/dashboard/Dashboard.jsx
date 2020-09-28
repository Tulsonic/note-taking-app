import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { compose } from "redux";
import { createNotebook, createNote } from "../../store/actions/contentActions";

// Components
import Favorites from "./Favorites";
import Recents from "./Recents";
import NoNotebooks from "./NoNotebooks";
import Navbar from "../navigation/NavBar";

const Dashboard = (props) => {
    const { notebooksFavorite, notebooksModifiedAt, auth } = props;

    if (!auth.uid) return <Redirect to="/signup" />;

    if (!isLoaded(notebooksModifiedAt) && !isLoaded(notebooksFavorite)) {
        return null;
    }

    if (isEmpty(notebooksModifiedAt) && isEmpty(notebooksFavorite)) {
        props.createNotebook({ name: "Untitled Notebook" }).then((resp) => {
            props.createNote(resp.id, { name: "Untitled Note" });
        });
    }

    const display =
        isEmpty(notebooksModifiedAt) && isEmpty(notebooksFavorite) ? null : (
            <div>
                <Favorites notebooks={notebooksFavorite} />
                <Recents notebooks={notebooksModifiedAt} />
            </div>
        );

    return (
        <div className="page-container">
            <Navbar page="dashboard" />
            <div className="page-componenet">{display}</div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        notebooksModifiedAt: state.firestore.ordered.notebooksModifiedAt,
        notebooksFavorite: state.firestore.ordered.notebooksFavorite,
    };
};

const mapDispatchToProps = (dispatch) => ({
    createNotebook: (notebook) => dispatch(createNotebook(notebook)),
    createNote: (notebookID, note) => dispatch(createNote(notebookID, note)),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props) => {
        if (!props.auth.uid) {
            return [];
        } else {
            return [
                {
                    collection: "users",
                    doc: props.auth.uid,
                    subcollections: [{ collection: "notebooks" }],
                    orderBy: ["modifiedAt", "desc"],
                    storeAs: "notebooksModifiedAt",
                },
                {
                    collection: "users",
                    doc: props.auth.uid,
                    subcollections: [{ collection: "notebooks" }],
                    where: ["favorite", "==", true],
                    storeAs: "notebooksFavorite",
                    orderBy: ["favoriteAt", "desc"],
                },
            ];
        }
    })
)(Dashboard);
