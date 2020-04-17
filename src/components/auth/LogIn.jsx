import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { logIn } from "../../store/actions/authActions";

const LogIn = (props) => {
    const { auth } = props;

    const [formState, setFormState] = useState({
        email: "",
        password: "",
    });

    if (auth.uid) return <Redirect to="/" />;

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        props.logIn(formState);
    };

    return (
        <div className="auth-form-contianer">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1>Log in</h1>
                <input
                    onChange={handleChange}
                    type="email"
                    id="email"
                    placeholder="Email"
                />
                <input
                    onChange={handleChange}
                    type="password"
                    id="password"
                    placeholder="Password"
                />
                <input type="submit" value="Log in" />
                {props.logInError ? (
                    <div className="auth-error">{props.logInError.message}</div>
                ) : null}
                <p>
                    Don't have an account?{" "}
                    <Link to="/signup" className="auth-alt">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => ({
    logInError: state.auth.authError,
    auth: state.firebase.auth,
});

const mapDispatchToProps = (dispatch) => ({
    logIn: (creds) => dispatch(logIn(creds)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
