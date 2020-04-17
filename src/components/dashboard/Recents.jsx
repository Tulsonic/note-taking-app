import React from "react";

import NotebookCover from "../notebooks/NotebookCover";

const Favorites = ({ notebooks }) => {
    return (
        <div className="sec-container">
            <h1 className="sec-title">Recents</h1>
            <hr />
            <div className="ntbk-con">
                {notebooks.map((notebook) => (
                    <NotebookCover notebook={notebook} key={notebook.id} />
                ))}
            </div>
        </div>
    );
};

export default Favorites;
