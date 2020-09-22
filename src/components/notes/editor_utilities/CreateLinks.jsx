import React, { useState, useEffect } from "react";

const Createlinks = props => {
    const [link, setLink] = useState("https://www.");

    const linkHandler = e => {
        setLink(e.target.value);
    };

    const submitHandler = e => {
        e.preventDefault();
        props.createLink(link, false);
        props.hideCreateLink();
    };

    const closeHandler = e => {
        if (e.target === e.currentTarget) {
            props.closeMenu();
        }
    };

    useEffect(() => {
        let searchElement = document.getElementById("link-input");
        searchElement.focus();
        searchElement.select();
    }, []);

    return (
        <div onClick={closeHandler} className="link-note-menu">
            <form onSubmit={submitHandler} className="create-link-container">
                <div onClick={props.hideCreateLink} className="close">
                    &times;
                </div>
                <h1>Create a hyperlink</h1>
                <input
                    id="link-input"
                    value={link}
                    onChange={linkHandler}
                    type="text"
                    autoComplete="off"
                />
                <input type="submit" value="link" />
            </form>
        </div>
    );
};

export default Createlinks;
