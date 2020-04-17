import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

const NotebookContent = props => {
    return (
        <div>
            <h1>chugnsu</h1>
        </div>
    );
};

const mapStateToProps = state => ({
    auth: state.firebase.auth
});

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => [
        {
            collection: "users",
            doc: props.auth.uid,
            subcollections: [
                { collection: "notebooks", doc: props.match.param },
                { collection: "notes" }
            ],
            storeAs: "notes"
        }
    ])
)(NotebookContent);
