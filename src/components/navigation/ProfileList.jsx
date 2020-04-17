import React from "react";
import { connect } from "react-redux";

import { logOut } from "../../store/actions/authActions";

const ProfileList = (props) => {
    const { profile } = props;

    const logOutHandler = (e) => {
        props.logOut();
    };

    return (
        <div className="list">
            <div className="list-title-container">
                <h1 className="note-title">
                    {profile.firstName + " " + profile.lastName}
                </h1>
            </div>
            <ul>
                <li>
                    <div onClick={logOutHandler} className="link">
                        <p>Log Out</p>
                    </div>
                </li>
            </ul>
        </div>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileList);
