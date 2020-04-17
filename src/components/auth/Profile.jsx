import React from "react";

const Profile = ({ profile }) => {
    return (
        <div className="profile">
            <div className="prof-in">
                <div className="prof-picture">
                    <p>{profile.initials}</p>
                </div>
                <div className="prof-name">
                    <span>{profile.firstName + " " + profile.lastName}</span>
                </div>
            </div>
        </div>
    );
};

export default Profile;
