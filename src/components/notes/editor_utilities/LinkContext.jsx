import React, { useState } from "react";

const LinkContext = props => {
    const { target } = props;

    const [link, setLink] = useState(target.href);
    const [lName, setLName] = useState(target.textContent);

    const nameHandler = e => {
        setLName(e.target.value);
    };

    const linkHandler = e => {
        setLink(e.target.value);
    };

    const submitHandler = e => {
        e.preventDefault();
        target.textContent = lName;
        target.href = link;
        props.hideContext();
    };

    const unlinkHandler = () => {
        props.unlink(target);
        props.hideContext();
    };

    return (
        <form onSubmit={submitHandler} id="linkContext" className="linkContext">
            <input
                onChange={nameHandler}
                className="name"
                type="text"
                value={lName}
            />
            <div className="border-left"></div>
            <input
                onChange={linkHandler}
                className="link"
                type="text"
                autoFocus
                value={link}
            />
            <div className="border-left"></div>
            <div onClick={unlinkHandler} className="close">
                <div className="button">
                    <div>&times;</div>
                </div>
            </div>
            <input type="submit" style={{ display: "none" }} />
        </form>
    );
};

export default LinkContext;
