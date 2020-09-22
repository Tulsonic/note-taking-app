import React from "react";

const NoteLinkContext = props => {
    const { target } = props;

    const unlinkHandler = () => {
        props.unlink(target);
        props.hideNoteContext();
    };

    const changeNoteHandler = () => {
        props.changeNoteLink(target);
        props.hideNoteContext();
    };

    return (
        <div id="note-link-context" className="note-link-context">
            <div onClick={changeNoteHandler} className="change-link">
                Change link
            </div>
            <div className="border-left"></div>
            <div onClick={unlinkHandler} className="close">
                <div className="button">
                    <div>&times;</div>
                </div>
            </div>
        </div>
    );
};

export default NoteLinkContext;
