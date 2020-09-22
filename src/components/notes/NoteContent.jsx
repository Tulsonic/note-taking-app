import React, { useState, useEffect, useCallback } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
import {
    changeNoteName,
    saveContent,
    addToHistory,
    removeHistory,
    resetHistory,
    createTodo,
    updateTodoValue,
    updateTodoContent,
    removeTodo,
} from "../../store/actions/contentActions";
import { updateContent } from "../../store/actions/documentActions";
import { ActionCreators as UndoActionCreators } from "redux-undo";

import TextEditor from "./TextEditor";
import ToolBar from "./ToolBar";
import Navbar from "../navigation/NavBar";

const NoteContent = (props) => {
    const {
        note,
        auth,
        historyArray,
        documentObj,
        updateContent,
        saveContent,
        todos,
        createTodo,
        updateTodoContent,
        updateTodoValue,
        removeTodo,
    } = props;

    const [iframe, setIframe] = useState(null);
    const [mutation, setMutation] = useState(null);
    const [title, setTitle] = useState(null);
    const [checkboxSetup, setCheckboxSetup] = useState(true);
    const [setup, setSetup] = useState(true);

    const history = useHistory();

    const delay = 500;
    let lastChange = 0;
    var checkboxArr = [];

    useEffect(() => {
        if (note) {
            setTitle(note.name);
            document.title = note.name + " - Write-it";
            !documentObj && updateContent(note.content);
        }
        return () => {
            setTitle(null);
        };
    }, [note, updateContent, documentObj]);

    useEffect(() => {
        if (checkboxSetup && todos && todos.length > 0 && iframe) {
            for (let i = 0; i < todos.length; i++) {
                let todo = todos[i];
                let el = iframe.contentDocument.getElementById(todo.id);
                if (el) {
                    el.firstChild.checked = todo.value;
                    checkboxArr.push(el.id);
                }
            }
            setCheckboxSetup(false);
        }
    }, [todos, iframe, checkboxSetup, checkboxArr]);

    useEffect(() => {
        if (iframe && setup) {
            //iframe.contentDocument.body.innerHTML = "";
            for (
                let i = 0;
                i < iframe.contentDocument.body.childNodes.length;
                i++
            ) {
                let el = iframe.contentDocument.body.childNodes[i];
                if (el && el.dataset.type === "code-block") {
                    el.childNodes[2].remove();
                    iframe.contentWindow.addTextEditor(el.childNodes[1]);
                }
            }
            setSetup(false);
        }
    }, [iframe, setup]);

    const updateSpecial = useCallback(() => {
        // move caret to the end of an element
        const moveToEnd = (el) => {
            let ran = iframe.contentWindow.document.createRange();
            ran.selectNodeContents(el);
            ran.collapse(false);
            let sel = iframe.contentWindow.getSelection();
            sel.removeAllRanges();
            sel.addRange(ran);
        };

        // move caret to a specific point in an element
        const moveCaret = (el, pos) => {
            let ranObj = iframe.contentDocument.createRange();
            let selObj = iframe.contentWindow.getSelection();
            ranObj.setStart(el, pos);
            ranObj.setEnd(el, pos);
            ranObj.collapse(true);
            selObj.removeAllRanges();
            selObj.addRange(ranObj);
        };

        if (iframe) {
            // get all children of body
            let childNodes = iframe.contentWindow.document.body.childNodes;

            // for every elment
            for (let i = 0; i < childNodes.length; i++) {
                // get element
                let el = childNodes[i];

                // clean leftovers if empty
                if (el.nodeName !== "DIV") {
                    let ch = el.childNodes;
                    if (ch.length === 0) {
                        let wrapper = document.createElement("div");
                        el.parentNode.insertBefore(wrapper, el);
                        wrapper.appendChild(el);
                        moveToEnd(wrapper);
                        continue;
                    } else {
                        for (let j = 0; j < ch.length; j++) {
                            let chEl = ch[j];
                            el.parentNode.insertBefore(chEl, el);
                            el.remove();
                        }
                    }
                }

                loop: for (let j = 0; j < checkboxArr.length; j++) {
                    let curID = checkboxArr[j];
                    for (let k = childNodes.length - 1; k >= 0; k--) {
                        let curEl = childNodes[k];
                        if (
                            curEl.dataset.innerContent &&
                            curEl.dataset.innerContent.includes(curID)
                        ) {
                            continue loop;
                        }
                    }
                    if (!iframe.contentDocument.getElementById(curID)) {
                        removeTodo(curID);
                        checkboxArr.splice(j, 1);
                    }
                }

                // tests to see if text will be a title
                let rel = el.textContent.split(/(?<=\s)/);
                let test = rel[0];
                let bullet = test
                    .trim()
                    .split("")
                    .every((c) => c === "*");
                // all title colors list
                const bulletColor = [
                    "#EF767A",
                    "#3687a3",
                    "#7BD389",
                    "#F18F01",
                ];
                let testingRel = rel[0];
                rel = rel[0].trim();

                // if span is added to save format while merging lines clear it
                el.childNodes.forEach((e) => {
                    if (e.nodeName === "SPAN" && e.dataset.type !== "link") {
                        if (el.dataset.type !== "title") {
                            let spCh = e.firstChild;
                            el.insertBefore(spCh, e);
                            e.remove();
                        } else {
                            if (e.dataset.type !== "hide-bullet") {
                                let spCh = e.firstChild;
                                el.insertBefore(spCh, e);
                                e.remove();
                            }
                        }
                    }
                });

                // if not a block or title, indent approprietly
                if (
                    el.dataset.type !== "title"
                    //&& el.dataset.type !== "code-block"
                ) {
                    for (let j = i; j >= 0; j--) {
                        let curNode = childNodes[j];
                        let style = iframe.contentWindow.getComputedStyle(
                            curNode
                        );
                        let numbMarg = parseInt(style.marginLeft, 10);
                        if (curNode.dataset.rank) {
                            el.style["margin-left"] =
                                (numbMarg + 40).toString() + "px";
                            break;
                        }
                        if (i === 0) {
                            el.style["margin-left"] = "0px";
                        }
                    }
                }

                // test to see if checklist item
                if (
                    ((rel === "[]" &&
                        test.trim().length > 0 &&
                        /\s$/.test(testingRel)) ||
                        (el.firstChild &&
                            el.firstChild.nodeName === "INPUT")) &&
                    el.dataset.type !== "checkbox"
                ) {
                    let cb;
                    if (el.firstChild.nodeName !== "INPUT") {
                        el.textContent = el.textContent.substring(2);
                        cb = iframe.contentWindow.document.createElement(
                            "INPUT"
                        );
                        cb.setAttribute("type", "checkbox");
                        el.insertBefore(cb, el.firstChild);
                        moveCaret(el.childNodes[1], 1);
                    } else {
                        cb = el.firstChild;
                    }
                    createTodo(
                        el.childNodes[1].textContent || "",
                        false,
                        props.match.params.noteID,
                        props.match.params.notebookID
                    ).then((resp) => {
                        el.id = resp.id;
                        checkboxArr.push(resp.id);
                    });
                    el.dataset.type = "checkbox";
                }

                // do the test to see if a codeBlock
                else if (
                    rel === "```" &&
                    test.trim().length > 0 &&
                    el.dataset.type !== "code-block" &&
                    /\s$/.test(testingRel)
                ) {
                    let nDiv = iframe.contentDocument.createElement("div");
                    let nTA = iframe.contentDocument.createElement("textarea");
                    let mode = iframe.contentDocument.createElement("textarea");
                    mode.style["display"] = "none";
                    mode.textContent = "javascript";
                    let empDiv = iframe.contentDocument.createElement("div");
                    empDiv.innerHTML = "<br>";
                    nDiv.contentEditable = false;
                    nDiv.dataset.type = "code-block";
                    iframe.contentDocument.body.insertBefore(nDiv, el);
                    nDiv.appendChild(mode);
                    nDiv.appendChild(nTA);
                    iframe.contentDocument.body.insertBefore(
                        empDiv,
                        nDiv.nextSibling
                    );
                    iframe.contentWindow.addTextEditor(nTA);
                    el.remove();
                }

                // do the test to see if a quote
                else if (
                    rel === '"""' &&
                    test.trim().length > 0 &&
                    el.dataset.type !== "quote" &&
                    /\s$/.test(testingRel)
                ) {
                    el.innerHTML = "";
                    el.dataset.type = "quote";
                    let nDiv = iframe.contentDocument.createElement("div");
                    el.appendChild(nDiv);
                    nDiv.innerHTML = "<br>";
                }

                // do the test to see if a note
                else if (
                    rel === "!!!" &&
                    test.trim().length > 0 &&
                    el.dataset.type !== "note" &&
                    /\s$/.test(testingRel)
                ) {
                    el.innerHTML = "";
                    el.dataset.type = "note";
                    let nDiv = iframe.contentDocument.createElement("div");
                    el.appendChild(nDiv);
                    nDiv.innerHTML = "<b>NOTE:</b> &nbsp;";
                    moveToEnd(nDiv);
                }

                // do the test to see if a title
                else if (
                    bullet &&
                    test.trim().length > 0 &&
                    el.dataset.type !== "title" &&
                    /\s$/.test(testingRel)
                ) {
                    // give neccesery attributes if formated like title
                    el.dataset.type = "title";
                    el.dataset.rank = rel.length.toString();
                }

                // based on element types

                // check if element is a checkbox
                if (el.dataset.type === "checkbox") {
                    if (
                        el === iframe.contentDocument.getElementById(el.id) &&
                        (el.firstChild.nodeName !== "INPUT" ||
                            el.firstChild.getAttribute("type") !== "checkbox" ||
                            !/\s$/.test(testingRel))
                    ) {
                        el.dataset.type = "";
                        removeTodo(el.id);
                        console.log(
                            el,
                            iframe.contentDocument.getElementById(el.id)
                        );
                        const ind = checkboxArr.indexOf(el.id);
                        checkboxArr.splice(ind, 1);
                        if (
                            el.firstChild.nodeName === "INPUT" &&
                            el.firstChild.getAttribute("type") === "checkbox"
                        ) {
                            el.removeChild(el.firstChild);
                            el.textContent = "[]" + el.textContent;
                            moveCaret(el.firstChild, 2);
                        }
                    }
                    if (el.dataset.checked === "true") {
                        el.firstChild.checked = true;
                        el.dataset.checked = "";
                    }
                }

                // if the element is codeBlock
                else if (el.dataset.type === "code-block") {
                    if (el.dataset.fold === "true") {
                        el.childNodes[1].remove();
                        iframe.contentWindow.addTextEditor(el.firstChild);
                        el.dataset.fold = "";
                    } else {
                        iframe.contentWindow.getValue(el);
                    }
                } else if (el.dataset.type === "quote") {
                } else if (el.dataset.type === "note") {
                }

                // if the element is title
                else if (el.dataset.type === "title") {
                    if (
                        !bullet ||
                        test.trim().length === 0 ||
                        !/\s$/.test(testingRel)
                    ) {
                        // remove them if not
                        el.dataset.type = "";
                        el.dataset.rank = "";
                    }

                    // check if we already have hidden bullets
                    if (el.firstChild && el.firstChild.nodeName === "SPAN") {
                        let curSpan = el.firstChild;
                        let textNode = el.childNodes[1];
                        let split = textNode.textContent.split(/(?<=\s)/);
                        let splitTest = split;

                        // if the hidden bullet container exits but nothing is in it delete it
                        if (curSpan.textContent.length === 0) {
                            el.removeChild(el.firstChild);
                        }

                        // if it is formated like a title
                        if (
                            splitTest[0].trim().split("").length === 0 ||
                            !splitTest[0]
                                .trim()
                                .split("")
                                .every((c) => c === "*")
                        ) {
                            // if the visible bulet is deleted, take one from the hidden bullets and make it visible
                            if (curSpan.textContent.length > 0) {
                                curSpan.textContent = curSpan.textContent.substring(
                                    1
                                );
                                textNode.textContent =
                                    "*" + textNode.textContent;
                                el.dataset.rank = parseInt(el.dataset.rank) - 1;
                                moveCaret(textNode, 1);
                            }
                        }
                        // an extra bullet is added hide one
                        if (
                            splitTest[0]
                                .trim()
                                .split("")
                                .every((c) => c === "*") &&
                            splitTest[0].trim().length > 1
                        ) {
                            curSpan.textContent += "*".repeat(
                                splitTest[0].trim().length - 1
                            );
                            textNode.textContent = textNode.textContent.substring(
                                splitTest[0].trim().length - 1
                            );
                            el.dataset.rank = parseInt(el.dataset.rank) + 1;
                            moveCaret(textNode, 1);
                        }
                    } else if (rel.length > 1) {
                        // if more than one bullet is visible hide the extra one by craeting a span
                        let colorSpan = iframe.contentWindow.document.createElement(
                            "SPAN"
                        );
                        colorSpan.dataset.type = "hide-bullet";
                        colorSpan.style["color"] = "white";
                        colorSpan.style["font-size"] = "10px";
                        let colored = "*".repeat(rel.length - 1);
                        colorSpan.textContent = colored;
                        el.textContent = el.textContent.substring(
                            colored.length
                        );
                        if (
                            el.firstChild &&
                            el.firstChild.nodeName !== "SPAN"
                        ) {
                            el.insertBefore(colorSpan, el.firstChild);
                        }
                        moveCaret(el.childNodes[1], 2);
                        el.dataset.rank = rel.length;
                    }

                    // special case title styles
                    switch (rel) {
                        case "*":
                            el.style["font-weight"] = "bold";
                            el.style["font-size"] = "40px";
                            break;
                        case "**":
                            el.style["font-weight"] = "bold";
                            el.style["font-size"] = "35px";
                            break;
                        case "***":
                            el.style["font-weight"] = "bold";
                            el.style["font-size"] = "30px";
                            break;
                        case "****":
                            el.style["font-weight"] = "bold";
                            el.style["font-size"] = "25px";
                            break;
                        default:
                            el.style["font-weight"] = "bold";
                            el.style["font-size"] = "22px";
                            break;
                    }

                    // set the color of titles
                    let index = rel.length % 4 === 0 ? 3 : (rel.length % 4) - 1;
                    el.style["color"] = bulletColor[index];

                    // set the rank and indent acording to title above
                    for (let j = i - 1; j >= -1; j--) {
                        if (j >= 0) {
                            let curNode = childNodes[j];
                            if (curNode.dataset.rank) {
                                let rank = Number(curNode.dataset.rank);
                                let style = iframe.contentWindow.getComputedStyle(
                                    curNode
                                );
                                if (rank < el.dataset.rank) {
                                    let numbMarg = parseInt(
                                        style.marginLeft,
                                        10
                                    );
                                    if (numbMarg > 0) {
                                        el.style["margin-left"] =
                                            (numbMarg + 15).toString() + "px";
                                    } else {
                                        el.style["margin-left"] = "15px";
                                    }
                                    break;
                                }
                            }
                        } else {
                            el.style["margin-left"] = "0px";
                        }
                    }
                } else {
                    // if not title
                    // if there is a bullet hider and the element is not a title delete it
                    if (el.firstChild && el.firstChild.nodeName === "SPAN") {
                        let elCon = el.textContent;
                        let fc = el.firstChild;
                        el.removeChild(fc);
                        el.textContent = elCon;
                        moveCaret(el.firstChild, fc.textContent.length + 1);
                    }
                    // appropriet indent for body children
                    // other special case colors and clean up
                    el.style["font-weight"] = "normal";
                    el.style["color"] = "black";
                    el.style["font-size"] = "20px";
                    el.style["text-decoration"] = "none";
                    if (el.getAttribute("id")) {
                        el.removeAttribute("id");
                    }
                    if (el.dataset.type !== "") {
                        el.dataset.type = "";
                    }
                    if (el.dataset.rank !== "") {
                        el.dataset.rank = "";
                    }
                }
            }
        }
    }, [iframe]);

    const updateTodos = useCallback(() => {
        let cn = iframe.contentDocument.body.childNodes;
        for (let i = 0; i < cn.length; i++) {
            let el = cn[i];
            if (el.dataset && el.dataset.type === "checkbox") {
                let exp = todos.filter((todo) => todo.id === el.id)[0];
                if (exp && exp.content !== el.textContent) {
                    updateTodoContent(el.textContent, exp.id);
                }
            }
        }
    }, [iframe, todos]);

    const changeContent = useCallback(() => {
        updateSpecial();
        updateTodos();
        if (iframe && lastChange < Date.now() - delay) {
            saveContent(
                iframe.contentWindow.document.body.innerHTML,
                props.match.params.noteID,
                props.match.params.notebookID
            );
            updateContent(iframe.contentWindow.document.body.innerHTML);
            lastChange = Date.now();
        }
    }, [
        iframe,
        todos,
        saveContent,
        updateContent,
        props.match.params.noteID,
        props.match.params.notebookID,
    ]);

    useEffect(() => {
        const config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true,
        };
        if (iframe) {
            var observer = new MutationObserver(changeContent);
            observer.observe(iframe.contentWindow.document.body, config);
            setMutation(observer);
        }
    }, [iframe, changeContent]);

    useEffect(() => {
        return () => {
            mutation && mutation.disconnect();
        };
    }, [mutation]);

    if (!auth.uid) {
        return <Redirect to={"/signup"} />;
    }

    if (!isLoaded(note) || !isLoaded(historyArray)) return null;

    if (isEmpty(note)) return null; // Note not found 404

    if (
        !props.match.params.noteID &&
        historyArray[historyArray.length - 2].split("/")[4] ===
            props.match.params.notebookID
    ) {
        props.resetHistory();
    }

    const previousNote = () => {
        if (historyArray.length > 0) {
            history.push(historyArray[historyArray.length - 1]);
            props.removeHistory();
        }
    };

    const noteToHistory = () => {
        if (
            historyArray[historyArray.length - 1] !== props.match.params.noteID
        ) {
            props.addToHistory(props.match.params.noteID);
        }
    };

    const changeHandler = (e) => {
        setTitle(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        props.changeNoteName(
            props.match.params.notebookID,
            props.match.params.noteID,
            title
        );
    };

    const iframeCallback = (_iframe) => {
        setIframe(_iframe);
    };

    const undoCallback = () => {
        if (documentObj.past.length > 0) {
            mutation.disconnect();
            let obj = documentObj.past[documentObj.past.length - 1];
            iframe.contentWindow.document.body.innerHTML =
                obj[Object.keys(obj)[0]];
            props.undo();
            const config = {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true,
            };
            mutation.observe(iframe.contentWindow.document.body, config);
            saveContent(
                iframe.contentWindow.document.body.innerHTML,
                props.match.params.noteID,
                props.match.params.notebookID
            );
        }
    };

    const redoCallback = () => {
        if (documentObj.future.length > 0) {
            mutation.disconnect();
            let obj = documentObj.future[0];
            iframe.contentWindow.document.body.innerHTML =
                obj[Object.keys(obj)[0]];
            props.redo();
            const config = {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true,
            };
            mutation.observe(iframe.contentWindow.document.body, config);
            saveContent(
                iframe.contentWindow.document.body.innerHTML,
                props.match.params.noteID,
                props.match.params.notebookID
            );
        }
    };

    return (
        <div className="note-content-container">
            <div className="actions"></div>
            <div className="note-content">
                <div className="title-container">
                    <form onSubmit={submitHandler}>
                        <input
                            maxLength="25"
                            type="text"
                            className="note-title"
                            id="name"
                            value={title}
                            onChange={changeHandler}
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </form>
                    <ToolBar
                        iframe={iframe}
                        noteToHistory={noteToHistory}
                        previousNote={previousNote}
                        undo={undoCallback}
                        redo={redoCallback}
                        displayBack={() => {
                            return historyArray.length > 0;
                        }}
                        updateTodoValue={updateTodoValue}
                    />
                </div>
                <div className="text-editor-container">
                    <TextEditor
                        iframeCallback={iframeCallback}
                        content={note.content}
                    />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state, props) => ({
    auth: state.firebase.auth,
    note: state.firestore.data[props.match.params.noteID + "-note"],
    todos: state.firestore.ordered[props.match.params.noteID + "-todos"],
    noNotes: state.communication.noNotes,
    historyArray: state.content.historyArray,
    documentObj: state.document,
});

const mapDispatchToProps = (dispatch) => ({
    changeNoteName: (notebookID, noteID, name) =>
        dispatch(changeNoteName(notebookID, noteID, name)),
    saveContent: (content, noteID, notebookID) =>
        dispatch(saveContent(content, noteID, notebookID)),
    addToHistory: (link) => dispatch(addToHistory(link)),
    removeHistory: () => dispatch(removeHistory()),
    resetHistory: () => dispatch(resetHistory()),
    updateContent: (content) => dispatch(updateContent(content)),
    undo: () => dispatch(UndoActionCreators.undo()),
    redo: () => dispatch(UndoActionCreators.redo()),
    createTodo: (content, value, noteID, notebookID) =>
        dispatch(createTodo(content, value, noteID, notebookID)),
    updateTodoContent: (content, todoID) =>
        dispatch(updateTodoContent(content, todoID)),
    updateTodoValue: (value, todoID) =>
        dispatch(updateTodoValue(value, todoID)),
    removeTodo: (todoID) => dispatch(removeTodo(todoID)),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props) => {
        if (!props.auth.uid) {
            return [];
        }
        return [
            {
                collection: "users",
                doc: props.auth.uid,
                subcollections: [
                    {
                        collection: "todos",
                    },
                ],
                where: ["noteID", "==", props.match.params.noteID],
                storeAs: props.match.params.noteID + "-todos",
            },
            {
                collection: "users",
                doc: props.auth.uid,
                subcollections: [
                    {
                        collection: "notebooks",
                        doc: props.match.params.notebookID,
                    },
                    { collection: "notes", doc: props.match.params.noteID },
                ],
                storeAs: props.match.params.noteID + "-note",
            },
        ];
    })
)(NoteContent);
