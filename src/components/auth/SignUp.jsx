import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { signUp } from "../../store/actions/authActions";
import { connect } from "react-redux";

const SignUp = (props) => {
    const { auth } = props;

    const [formState, setFormState] = useState({
        email: "",
        firstName: "",
        lastName: "",
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
        props.signUp(formState);
    };

    return (
        <div className="auth-form-contianer">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Sign up</h1>
                <input
                    onChange={handleChange}
                    type="email"
                    id="email"
                    placeholder="Email"
                />
                <input
                    onChange={handleChange}
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                />
                <input
                    onChange={handleChange}
                    type="text"
                    id="lastName"
                    placeholder="Last Name"
                />
                <input
                    onChange={handleChange}
                    type="password"
                    id="password"
                    placeholder="Password"
                />
                <input type="submit" value="Sign up" />
                {props.signUpError ? (
                    <div className="auth-error">{props.logInError.message}</div>
                ) : null}
                <p>
                    Already got an account?{" "}
                    <Link to="/login" className="auth-alt">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => ({
    signUpError: state.auth.authError,
    auth: state.firebase.auth,
});

const mapDispatchToProps = (dispatch) => ({
    signUp: (newUser) => dispatch(signUp(newUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
