import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { compose } from "redux";

// Components
import Favorites from "./Favorites";
import Recents from "./Recents";
import NoNotebooks from "./NoNotebooks";

const Dashboard = (props) => {
    const { notebooksFavorite, notebooksModifiedAt, auth } = props;

    if (!auth.uid) return <Redirect to="/signup" />;

    if (!isLoaded(notebooksModifiedAt) && !isLoaded(notebooksFavorite)) {
        return null;
    }

    const display =
        isEmpty(notebooksModifiedAt) && isEmpty(notebooksFavorite) ? (
            <NoNotebooks />
        ) : (
            <div>
                <Favorites notebooks={notebooksFavorite} />
                <Recents notebooks={notebooksModifiedAt} />
            </div>
        );

    return <div className="page-componenet">{display}</div>;
};

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        notebooksModifiedAt: state.firestore.ordered.notebooksModifiedAt,
        notebooksFavorite: state.firestore.ordered.notebooksFavorite,
    };
};

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps),
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
