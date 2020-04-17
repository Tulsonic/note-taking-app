import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
    deleteItem,
    favoriteNotebook,
    deleteNotebookSignal,
} from "../../store/actions/contentActions";

const ListItem = (props) => {
    const { notebook, note, notebookID } = props;

    const link = note
        ? "/notebook/" + notebookID + "/note/" + note.id
        : "/notebook/" + notebook.id + "/note/notebook";
    const name = note ? note.name : notebook.name;

    const trashOnClickHandler = (e) => {
        if (note) {
            props.deleteItem(notebookID, note.id);
        } else {
            props.deleteNotebookSignal(notebook.id, notebook.name);
        }
    };

    const favOnClickHandler = (e) => {
        if (notebook.favorite) {
            props.favoriteNotebook(notebook.id, false);
        } else {
            props.favoriteNotebook(notebook.id, true);
        }
    };

    const fav =
        notebook && notebook.favorite ? (
            <div className="fas fa-star"></div>
        ) : (
            <div className="far fa-star"></div>
        );

    const icons = note ? (
        <div className="icons">
            <div className="trash" onClick={trashOnClickHandler}>
                <div className="fas fa-trash"></div>
            </div>
        </div>
    ) : (
        <div className="icons">
            <div className="trash" onClick={trashOnClickHandler}>
                <div className="fas fa-trash"></div>
            </div>
            <div className="star" onClick={favOnClickHandler}>
                {fav}
            </div>
        </div>
    );

    return (
        <li>
            <NavLink to={link} className="link">
                <p>{name}</p>
            </NavLink>
            {icons}
        </li>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    deleteItem: (notebookID, noteID) =>
        dispatch(deleteItem(notebookID, noteID)),
    deleteNotebookSignal: (notebookID, notebookName) =>
        dispatch(deleteNotebookSignal(notebookID, notebookName)),
    favoriteNotebook: (notebookID, state) =>
        dispatch(favoriteNotebook(notebookID, state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);
