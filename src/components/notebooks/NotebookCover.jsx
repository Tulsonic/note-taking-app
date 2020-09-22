import React from "react";
import { useHistory } from "react-router-dom";

import { connect } from "react-redux";

import { updateModifiedAt } from "../../store/actions/contentActions";

import Cover from "../../images/BookCover.svg";

const NotebookCover = props => {
    const { notebook } = props;
    const history = useHistory();
    const link = "/notebook/" + notebook.id + "/note/notebook";

    const onClickHandler = e => {
        props.updateModifiedAt(notebook.id);
        history.push(link);
    };

    return (
        <div onClick={onClickHandler} className="notebook">
            <img className="notebook-cover" src={Cover} alt="" />
            <div className="title-container">
                <h1>{notebook.name}</h1>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    updateModifiedAt: notebookID => dispatch(updateModifiedAt(notebookID))
});

export default connect(mapStateToProps, mapDispatchToProps)(NotebookCover);
