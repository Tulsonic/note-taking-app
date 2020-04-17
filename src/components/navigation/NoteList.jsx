import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { useHistory, Link } from "react-router-dom";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";

import {
    resetItemDeleted,
    createNote,
} from "../../store/actions/contentActions";
import {
    noNotes,
    resetNoNotes,
} from "../../store/actions/communicationActions";

import ListItem from "./ListItem";

const NoteList = (props) => {
    const { notes, notebook, itemDeleted, params } = props;

    const history = useHistory();

    const [notebookState, setNotebookState] = useState(null);
    const [noteArray, setNoteArray] = useState(null);

    useEffect(() => {
        notebook && setNotebookState(notebook);
        notes && setNoteArray(notes);
        return () => {
            setNotebookState(null);
            setNoteArray(null);
        };
    }, [notebook, notes]);

    useEffect(() => {
        return () => {};
    }, []);

    if (!isLoaded(notes) || !isLoaded(notebook) || !isLoaded(itemDeleted)) {
        return null;
    }

    if (isEmpty(notebook)) {
        history.push("/");
        return null;
    }

    if (isEmpty(notes)) {
        props.noNotes();
    } else {
        props.resetNoNotes();
    }

    if (params.noteID === "notebook" && !isEmpty(noteArray)) {
        history.push(
            "/notebook/" + params.notebookID + "/note/" + noteArray[0].id
        );
    }

    if (itemDeleted) {
        if (!isEmpty(notes)) {
            history.push(
                "/notebook/" + params.notebookID + "/note/" + notes[0].id
            );
            props.resetItemDeleted();
        }
    }

    const renameHandler = (e) => {
        props.renameNotebookCallback(notebookState.name);
    };

    return (
        <div className="list">
            <div className="list-title-container">
                <Link to="/" className="back">
                    &#171;
                </Link>
                <h1 onClick={renameHandler} className="note-title clickable">
                    {notebookState && notebookState.name}
                </h1>
            </div>
            <ul>
                {noteArray &&
                    noteArray.map((note) => (
                        <ListItem
                            key={note.id}
                            note={note}
                            notebookID={params.notebookID}
                        />
                    ))}
            </ul>
        </div>
    );
};

const mapStateToProps = (state, props) => {
    return {
        auth: state.firebase.auth,
        notes: state.firestore.ordered[props.params.notebookID + "-notes"],
        notebook: state.firestore.data[props.params.notebookID + "-notebook"],
        itemDeleted: state.content.itemDeleted,
    };
};

const mapDispatchToProps = (dispatch) => ({
    resetItemDeleted: () => dispatch(resetItemDeleted()),
    createNote: (notebookID, note) => dispatch(createNote(notebookID, note)),
    noNotes: () => dispatch(noNotes()),
    resetNoNotes: () => dispatch(resetNoNotes()),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props) => {
        if (!props.auth.uid) {
            return [];
        }
        return [
            {
                collection: "users",
                doc: props.auth.uid,
                subcollections: [
                    { collection: "notebooks", doc: props.params.notebookID },
                    { collection: "notes" },
                ],
                orderBy: ["createdAt", "asc"],
                storeAs: props.params.notebookID + "-notes",
            },
            {
                collection: "users",
                doc: props.auth.uid,
                subcollections: [
                    { collection: "notebooks", doc: props.params.notebookID },
                ],
                storeAs: props.params.notebookID + "-notebook",
            },
        ];
    })
)(NoteList);
