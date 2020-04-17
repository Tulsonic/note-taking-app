import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
import {
    changeNoteName,
    saveContent,
} from "../../store/actions/contentActions";

import TextEditor from "./TextEditor";
import ToolBar from "./ToolBar";

const NoteContent = (props) => {
    const { note, noNotes, auth } = props;

    const [iframe, setIframe] = useState(null);
    const [title, setTitle] = useState(null);
    const [content, setContent] = useState(null);

    useEffect(() => {
        note && setTitle(note.name);
        note && setContent(note.content);
        return () => {
            setTitle(null);
            setContent(null);
        };
    }, [note]);

    if (!auth.uid) {
        return <Redirect to={"/signup"} />;
    }

    if (!isLoaded(note)) return null;

    if (noNotes) {
        return (
            <div className="no-notes-container">
                <div className="text-container">
                    <div className="face">{"(>人<)"}</div>
                    <h1>This notebook is empty!</h1>
                </div>
            </div>
        );
    }

    if (isEmpty(note)) return null; // Note not found 404

    const changeHandler = (e) => {
        setTitle(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        props.changeNoteName(
            props.match.params.notebookID,
            props.match.params.noteID,
            title
        );
    };

    const iframeCallback = (_iframe) => {
        setIframe(_iframe);
    };

    const saveContentCallback = (_content) => {
        props.saveContent(
            _content,
            props.match.params.noteID,
            props.match.params.notebookID
        );
    };

    return (
        <div className="note-content-container">
            <div className="actions"></div>
            <div className="note-content">
                <div className="title-container">
                    <form onSubmit={submitHandler}>
                        <input
                            maxLength="25"
                            type="text"
                            id="name"
                            value={title}
                            onChange={changeHandler}
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </form>
                    <ToolBar
                        iframe={iframe}
                        saveContentCallback={saveContentCallback}
                    />
                </div>
                <TextEditor
                    saveContentCallback={saveContentCallback}
                    iframeCallback={iframeCallback}
                    content={content}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state, props) => ({
    auth: state.firebase.auth,
    note: state.firestore.data[props.match.params.noteID + "-note"],
    noNotes: state.communication.noNotes,
});

const mapDispatchToProps = (dispatch) => ({
    changeNoteName: (notebookID, noteID, name) =>
        dispatch(changeNoteName(notebookID, noteID, name)),
    saveContent: (content, noteID, notebookID) =>
        dispatch(saveContent(content, noteID, notebookID)),
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
                    {
                        collection: "notebooks",
                        doc: props.match.params.notebookID,
                    },
                    { collection: "notes", doc: props.match.params.noteID },
                ],
                storeAs: props.match.params.noteID + "-note",
            },
        ];
    })
)(NoteContent);
