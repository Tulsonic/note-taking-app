import React from "react";
import { Route } from "react-router-dom";
import Navbar from "../components/navigation/NavBar";
import AuthPage from "../components/auth/AuthPage";

export const LoggedRouter = ({ component: Componenet, ...rest }) => {
    return (
        <Route
            {...rest}
            component={(props) => (
                <div className="page-container">
                    <Navbar position={{ position: "absolute" }} />
                    <Componenet {...props} />
                </div>
            )}
        />
    );
};

export const NonLoggedRouter = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            component={(props) => (
                <div className="auth-page-container">
                    <AuthPage />
                    <Component {...props} />
                </div>
            )}
        />
    );
};
