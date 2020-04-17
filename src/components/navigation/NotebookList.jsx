import React from "react";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";

import ListItem from "./ListItem";

const NotebookList = (props) => {
    const { notebooks } = props;

    if (!isLoaded(notebooks)) {
        return null;
    }

    return (
        <div className="list">
            <div className="list-title-container">
                <h1 className="notebook-title ">Notebooks</h1>
            </div>
            <ul>
                {notebooks.map((notebook) => (
                    <ListItem key={notebook.id} notebook={notebook} />
                ))}
            </ul>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        notebooks: state.firestore.ordered.notebooks,
    };
};

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps),
    firestoreConnect((props) => {
        if (!props.auth.uid) {
            return [];
        }
        return [
            {
                collection: "users",
                doc: props.auth.uid,
                subcollections: [{ collection: "notebooks" }],
                orderBy: ["createdAt", "asc"],
                storeAs: "notebooks",
            },
        ];
    })
)(NotebookList);
