import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

// Actions

// Components
import NoteList from "./NoteList";
import NotebookList from "./NotebookList";
import ProfileList from "./ProfileList";
import Profile from "../auth/Profile";
import CoverMenu from "./CoverMenu";

const NavBar = (props) => {
    const [addMenu, setAddMenu] = useState(false);
    const [renameMenu, setRenameMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [notebookRename, setNotebookRename] = useState(null);

    const { profile } = props;

    const containsNotebook = window.location.pathname.includes("/notebook")
        ? true
        : false;

    const closeMenu = () => {
        setAddMenu(false);
        setRenameMenu(false);
    };

    const renameNotebookCallback = (e) => {
        setRenameMenu(true);
        setNotebookRename(e);
    };

    const profileCloseHandler = (e) => {
        setProfileMenu(false);
    };

    var navContent;

    if (profileMenu) {
        navContent = (
            <div>
                <div onClick={profileCloseHandler} className="close-container">
                    <span className="profile-close">&times;</span>
                </div>
                <ProfileList profile={profile} />
            </div>
        );
    } else if (containsNotebook) {
        navContent = (
            <NoteList
                params={props.match.params}
                renameNotebookCallback={renameNotebookCallback}
            />
        );
    } else {
        navContent = <NotebookList />;
    }

    const caption = containsNotebook ? "note" : "notebook";

    const onClickHandler = (e) => {
        setAddMenu(true);
    };

    const profileClickHandler = (e) => {
        setProfileMenu(true);
    };

    return (
        <div className="nav-cont" style={props.position}>
            <nav>
                <CoverMenu
                    addMenu={addMenu}
                    renameMenu={renameMenu}
                    closeMenu={closeMenu}
                    notebookName={notebookRename}
                    containsNotebook={containsNotebook}
                    params={props.match.params}
                />
                <div className="close-nav">
                    <div
                        className="fas fa-times"
                        onClick={() => {
                            document.getElementsByTagName(
                                "nav"
                            )[0].style.width = "0px";
                            document.getElementById("open-btn").style.width =
                                "50px";
                        }}
                    ></div>
                </div>
                <div className="logo">
                    <Link to="/" className="logo-title">
                        Write-it
                    </Link>
                </div>
                <div className="container">{navContent}</div>
                <div>
                    <button
                        onClick={onClickHandler}
                        className="new-notebook"
                        type="button"
                    >
                        <span>Create new {caption}</span>
                    </button>
                    <div onClick={profileClickHandler}>
                        <Profile profile={profile} />
                    </div>
                </div>
            </nav>
            <div
                id="open-btn"
                className="open-btn"
                onClick={(el) => {
                    document.getElementsByTagName("nav")[0].style.width =
                        "400px";
                    el.target.style.width = "0px";
                }}
            >
                <div className="fas fa-angle-right"></div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    profile: state.firebase.profile,
});

const mapDispatchToProps = () => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
