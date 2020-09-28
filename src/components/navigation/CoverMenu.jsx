import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import {
    createNotebook,
    deleteNotebookSignalReset,
    createNote,
    deleteItem,
    changeNotebookName,
} from "../../store/actions/contentActions";

const CoverMenu = (props) => {
    const {
        containsNotebook,
        addMenu,
        renameMenu,
        notebookName,
        deletingNotebookID,
        deletingNotebookName,
        params,
    } = props;

    const [newItem, setNewItem] = useState(null);
    const [caption, setCaption] = useState(null);
    const [placeholder, setPlaceholder] = useState(null);
    const [value, setValue] = useState(null);

    const resetState = () => {
        props.deleteNotebookSignalReset();
        setCaption(null);
        setPlaceholder(null);
        setValue(null);
    };

    useEffect(() => {
        return () => {
            resetState();
        };
    }, []);

    const onCoverClickHandler = (e) => {
        if (e.target.id === "cover" || e.target.id === "exit") {
            resetState();
            props.closeMenu();
        }
    };

    const onChangeHandler = (e) => {
        setNewItem({ [e.target.id]: e.target.value });
        setValue(e.target.value);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (addMenu) {
            if (containsNotebook) {
                props.createNote(params.notebookID, newItem);
                props.closeMenu();
            } else {
                props.createNotebook(newItem).then((resp) => {
                    props.createNote(resp.id, { name: "Untitled Note" });
                });
                props.closeMenu();
            }
        } else if (renameMenu) {
            props.changeNotebookName(props.params.notebookID, newItem.name);
        }
        resetState();
        props.closeMenu();
    };

    const deleteNotebookHandler = (e) => {
        props.deleteItem(deletingNotebookID);
    };

    if (addMenu && (caption == null || placeholder == null)) {
        if (containsNotebook) {
            // adding a new note
            setCaption("Create a new note");
            setPlaceholder("Note title");
        } else {
            // adding a new notebook
            setCaption("Create a new notebook");
            setPlaceholder("Notebook title");
        }
    } else if (
        renameMenu &&
        (caption == null || placeholder == null || value == null)
    ) {
        // renaming a notebook
        setCaption("Rename the notebook");
        setPlaceholder("New name");
        setValue(notebookName);
    } else if (deletingNotebookID !== null && caption === null) {
        setCaption('Delete "' + deletingNotebookName + '" ?');
    }

    if (!addMenu && !renameMenu && deletingNotebookID === null) {
        return null;
    }

    return (
        <div onClick={onCoverClickHandler} className="cover" id="cover">
            <form onSubmit={onSubmitHandler}>
                <div className="contain">
                    <span id="exit">&times;</span>
                </div>
                <div className="form-inner">
                    <h1>{caption}</h1>
                    {deletingNotebookID !== null ? (
                        <input
                            onClick={deleteNotebookHandler}
                            type="button"
                            className="action-button"
                            value="Delete"
                            id="create"
                        />
                    ) : (
                        <div>
                            <input
                                autoFocus
                                type="text"
                                id="name"
                                maxLength="25"
                                onChange={onChangeHandler}
                                placeholder={placeholder}
                                value={value}
                                autoComplete="off"
                                style={{ display: "block" }}
                            />
                            <input
                                className="action-button"
                                type="submit"
                                value="Create"
                                id="create"
                                style={{ display: "block" }}
                            />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => ({
    deletingNotebookID: state.content.deletingNotebookID,
    deletingNotebookName: state.content.deletingNotebookName,
});

const mapDispatchToProps = (dispatch) => ({
    createNotebook: (notebook) => dispatch(createNotebook(notebook)),
    createNote: (notebookID, note) => dispatch(createNote(notebookID, note)),
    deleteItem: (notebookID, noteID) =>
        dispatch(deleteItem(notebookID, noteID)),
    deleteNotebookSignalReset: () => dispatch(deleteNotebookSignalReset()),
    changeNotebookName: (notebookID, name) =>
        dispatch(changeNotebookName(notebookID, name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CoverMenu);
