import React from "react";
import { isEmpty } from "react-redux-firebase";

// Components
import NotebookCover from "../notebooks/NotebookCover";

const Favorites = ({ notebooks }) => {
    if (isEmpty(notebooks)) {
        return null;
    }

    return (
        <div className="sec-container">
            <h1 className="sec-title">Favorites</h1>
            <hr />
            <div className="ntbk-con">
                {notebooks &&
                    notebooks.map((notebook) => (
                        <NotebookCover notebook={notebook} key={notebook.id} />
                    ))}
            </div>
        </div>
    );
};

export default Favorites;
