import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { createNote } from "../../../store/actions/contentActions";

const NoteItem = (props) => {
    const { note, selectedNote } = props;

    let className = selectedNote === note ? "selected" : null;

    return (
        <div
            onClick={(e) => {
                props.selectNote(note);
            }}
            className={"note-item " + className}
        >
            <h1>{note.name}</h1>
        </div>
    );
};

const LinkNotes = (props) => {
    const { notes, search, auto } = props;

    const [selectedNote, setSelectedNote] = useState(null);
    const [noteArray, setNoteArray] = useState(notes);
    const [searchVal, setSearchVal] = useState(search.trim());

    useEffect(() => {
        setNoteArray(
            notes.filter((note) =>
                note.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [notes, search]);

    useEffect(() => {
        if (noteArray.length === 0) {
            setSelectedNote("create");
        } else {
            setSelectedNote(noteArray[0]);
        }
    }, [noteArray]);

    useEffect(() => {
        let searchElement = document.getElementById("search-bar");
        searchElement.focus();
        searchElement.select();
    }, []);

    if (auto) {
        let item = notes.filter(
            (e) => e.name.toLowerCase() === search.toLowerCase()
        );
        if (item.length > 0) {
            props.createLink(item[0].id, true);
            props.closeMenu();
        }
    }

    const selectNote = (e) => {
        setSelectedNote(e);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!selectedNote) {
            props.closeMenu();
        } else if (selectedNote === "create") {
            props
                .createNote(window.location.pathname.split("/")[2], {
                    name: searchVal,
                })
                .then((resp) => {
                    props.createLink(resp.id, true);
                    props.closeMenu();
                });
        } else {
            props.createLink(selectedNote.id, true);
            props.closeMenu();
        }
    };

    const closeHandler = (e) => {
        if (e.target === e.currentTarget) {
            props.closeMenu();
        }
    };

    const changeHandler = (e) => {
        setSearchVal(e.target.value);
        setNoteArray(
            notes.filter((note) =>
                note.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    };

    var className =
        noteArray.length === 0 || selectedNote === "create" ? "selected" : null;
    var displayState =
        noteArray.length === 1 &&
        noteArray[0].name.toLowerCase() === searchVal.toLowerCase()
            ? "none"
            : "block";

    return (
        <div onClick={closeHandler} className="link-note-menu">
            <form onSubmit={submitHandler} className="menu-container">
                <div onClick={props.closeMenu} className="close">
                    &times;
                </div>
                <h1>Link a note</h1>
                <input
                    id="search-bar"
                    value={searchVal}
                    onChange={changeHandler}
                    type="text"
                    autoComplete="off"
                />
                <div className="list-container">
                    {notes &&
                        noteArray.map((note) => (
                            <NoteItem
                                selectedNote={selectedNote}
                                selectNote={selectNote}
                                key={note.id}
                                note={note}
                            />
                        ))}
                    <div
                        style={{ display: displayState }}
                        onClick={() => setSelectedNote("create")}
                        className={"note-item " + className}
                    >
                        <h1>Create new "{searchVal}"</h1>
                    </div>
                </div>
                <input type="submit" value="link" />
            </form>
        </div>
    );
};

const mapStateToProps = (state) => {
    let notesURL = window.location.pathname.split("/")[2];
    return {
        notes: state.firestore.ordered[notesURL + "-notes"],
    };
};

const mapDispatchToProps = (dispatch) => ({
    createNote: (notebookID, note) => dispatch(createNote(notebookID, note)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LinkNotes);
