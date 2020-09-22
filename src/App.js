// Utilities
import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

// Components
import Dashboard from "./components/dashboard/Dashboard";
import NoteContent from "./components/notes/NoteContent";
import SignUp from "./components/auth/SignUp";
import LogIn from "./components/auth/LogIn";

// HOC
import { LoggedRouter } from "./HOC/routerHOC";
import { Route } from "react-router-dom";
import { NonLoggedRouter } from "./HOC/routerHOC";

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <LoggedRouter
                        path="/notebook/:notebookID/note/:noteID"
                        component={NoteContent}
                    />
                </Switch>
                <Switch>
                    <NonLoggedRouter path="/signup" component={SignUp} />
                    <NonLoggedRouter path="/login" component={LogIn} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
