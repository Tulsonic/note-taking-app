import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

import LinkContext from "./editor_utilities/LinkContext";
import NoteLinkContext from "./editor_utilities/NoteLinkContext";
import LinkNotes from "./editor_utilities/LinkNotes";
import Createlinks from "./editor_utilities/CreateLinks";

const ToolBar = (props) => {
    const [localIframe, setLocalIframe] = useState(null);
    const [contextState, setContextState] = useState(null);
    const [noteContextState, setNoteContextState] = useState(null);
    const [createLinkState, setCreateLinkState] = useState(null);
    const [linkState, setLinkState] = useState(null);

    const { iframe, displayBack, updateTodoValue } = props;
    const history = useHistory();

    useEffect(() => {
        setLocalIframe(iframe);
        return () => {
            setLocalIframe(null);
        };
    }, [iframe]);

    const execCmd = (cmd, args) => {
        if (args) {
            localIframe.contentDocument.execCommand(cmd, false, args);
        } else {
            localIframe.contentDocument.execCommand(cmd, false, null);
        }
        localIframe.contentDocument.getElementsByTagName("body")[0].focus();
    };

    const getParents = (e, tag) => {
        let parents = [];
        while (e.parentNode && e.parentNode.nodeName !== "BODY") {
            e = e.parentNode;
            if (tag) {
                parents.push(e.tagName);
            } else {
                parents.push(e);
            }
        }
        return parents;
    };

    const checkParent = (e, name) => {
        while (e.parentNode) {
            e = e.parentNode;
            if (e.nodeName === name.toUpperCase()) {
                return e;
            }
        }
        return null;
    };

    const getActiveDiv = () => {
        let obj = localIframe.contentDocument.getSelection();
        if (obj.anchorNode.nodeType !== Node.TEXT_NODE) {
            return obj.anchorNode;
        } else {
            let parNode = obj.anchorNode.parentNode;
            return parNode;
        }
    };

    const checkParentType = (e, type) => {
        while (e.parentNode) {
            e = e.parentNode;
            if (e.dataset && e.dataset.type === type) {
                return e;
            }
        }
        return null;
    };

    const moveToEnd = (el) => {
        let ran = iframe.contentWindow.document.createRange();
        ran.selectNodeContents(el);
        ran.collapse(false);
        let sel = iframe.contentWindow.getSelection();
        sel.removeAllRanges();
        sel.addRange(ran);
    };

    const addElmentAfterCursor = async (el) => {
        let sel = localIframe.contentWindow.getSelection();
        let ran = sel.getRangeAt(0);
        ran.insertNode(el);
        sel.removeAllRanges();
        return el;
    };

    const keyHandler = useCallback((e) => {
        if (e.ctrlKey && e.key === "Backspace") {
            e.preventDefault();
            props.previousNote();
        }
        if (e.ctrlKey && e.key === "l") {
            e.preventDefault();
            execCmd("insertUnorderedList");
        }
        if (e.ctrlKey && e.key === "z") {
            e.preventDefault();
            props.undo();
        }
        if (e.ctrlKey && e.key === "y") {
            e.preventDefault();
            props.redo();
        }
        if (e.key === "ArrowUp") {
            let ps = getActiveDiv().previousSibling;
            if (
                ps &&
                ps.getAttribute("contentEditable", "false") &&
                (!ps.previousSibling ||
                    ps.previousSibling.getAttribute("contentEditable", "false"))
            ) {
                e.preventDefault();
                let nDiv = localIframe.contentDocument.createElement("div");
                nDiv.innerHTML = "<br>";
                localIframe.contentDocument.body.insertBefore(nDiv, ps);
                moveToEnd(nDiv);
            }
        }
        if (e.key === "ArrowDown") {
            let ns = getActiveDiv().nextSibling;
            if (
                ns &&
                ns.getAttribute("contentEditable", "false") &&
                (!ns.nextSibling ||
                    ns.nextSibling.getAttribute("contentEditable", "false"))
            ) {
                e.preventDefault();
                let nDiv = localIframe.contentDocument.createElement("div");
                nDiv.innerHTML = "<br>";
                localIframe.contentDocument.body.insertBefore(
                    nDiv,
                    ns.nextSibling
                );
                moveToEnd(nDiv);
            }
        }
        if (
            e.ctrlKey &&
            e.key === "Enter" &&
            (getActiveDiv().tagName === "LI" ||
                checkParent(getActiveDiv(), "LI"))
        ) {
            e.preventDefault();
            let el;
            if (getActiveDiv().tagName === "LI") {
                el = getActiveDiv();
            } else {
                el = checkParent(getActiveDiv(), "LI");
            }
            let nLi = localIframe.contentWindow.document.createElement("li");
            nLi.innerHTML = "<br>";
            el.parentNode.insertBefore(nLi, el.nextSibling);
            moveToEnd(nLi);
        }
        if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();
            let ad = getActiveDiv();
            let newDiv = localIframe.contentWindow.document.createElement(
                "DIV"
            );
            if (ad.dataset.type === "title") {
                newDiv.textContent = "*".repeat(Number(ad.dataset.rank));
                newDiv.textContent = newDiv.textContent + "\xa0";
                localIframe.contentWindow.document.body.insertBefore(
                    newDiv,
                    ad.nextSibling
                );
                moveToEnd(newDiv);
            } else if (ad.dataset.type === "checkbox") {
                let cb = localIframe.contentWindow.document.createElement(
                    "INPUT"
                );
                cb.setAttribute("type", "checkbox");
                newDiv.textContent = "\xa0";
                newDiv.insertBefore(cb, newDiv.firstChild);
                localIframe.contentWindow.document.body.insertBefore(
                    newDiv,
                    ad.nextSibling
                );
                moveToEnd(newDiv);
            } else if (
                ad.parentNode.dataset.type === "quote" ||
                ad.parentNode.dataset.type === "note"
            ) {
                newDiv.innerHTML = "<br>";
                localIframe.contentWindow.document.body.insertBefore(
                    newDiv,
                    ad.parentNode.nextSibling
                );
                moveToEnd(newDiv);
            }
        } else if (
            e.key === "Enter" &&
            (getActiveDiv().tagName === "LI" ||
                checkParent(getActiveDiv(), "LI"))
        ) {
            e.preventDefault();
            let el;
            if (getActiveDiv().tagName === "LI") {
                el = getActiveDiv();
            } else {
                el = checkParent(getActiveDiv(), "LI");
            }
            let nDiv = localIframe.contentWindow.document.createElement("div");
            nDiv.innerHTML = "<br>";
            el.parentNode.parentNode.parentNode.insertBefore(
                nDiv,
                el.parentNode.parentNode.nextSibling
            );
            moveToEnd(nDiv);
        }
        if (
            e.shiftKey &&
            e.key === "Enter" &&
            getActiveDiv().dataset.type === "title"
        ) {
            e.preventDefault();
            const el = getActiveDiv();
            if (!el.dataset.innerContent || el.dataset.innerContent === "") {
                const ind = Array.prototype.indexOf.call(
                    el.parentNode.childNodes,
                    el
                );
                let elArr = [];
                let elArrOut = [];
                for (
                    let i = ind + 1;
                    i < el.parentNode.childNodes.length;
                    i++
                ) {
                    let curEl = el.parentNode.childNodes[i];
                    if (
                        curEl.dataset.rank !== "" &&
                        curEl.dataset.rank <= el.dataset.rank
                    ) {
                        break;
                    } else {
                        if (
                            curEl.dataset.type === "checkbox" &&
                            curEl.firstChild.checked
                        ) {
                            curEl.dataset.checked = "true";
                        }
                        if (curEl.dataset.type === "code-block") {
                            curEl.dataset.fold = "true";
                        }
                        elArr.push(curEl);
                    }
                }
                if (elArr.length > 0) {
                    for (let i = elArr.length - 1; i >= 0; i--) {
                        let curEl = elArr[i];
                        if (
                            !/^\s*$/.test(curEl.textContent) &&
                            curEl.textContent.length > 0
                        ) {
                            break;
                        } else {
                            elArr.pop();
                        }
                    }
                    elArr.forEach((e) => {
                        e.parentNode.removeChild(e);
                        elArrOut.push(e.outerHTML);
                    });
                    let joined = elArrOut.join("");
                    el.dataset.innerContent = joined;
                    el.style.borderBottom = "2px solid " + el.style.color;
                }
            } else {
                let temp = document.createElement("div");
                temp.style["display"] = "none";
                temp.innerHTML = el.dataset.innerContent;
                for (let i = temp.childNodes.length - 1; i >= 0; i--) {
                    let next = el.nextSibling;
                    let curEl = temp.childNodes[i];
                    el.parentNode.insertBefore(curEl, next);
                }
                el.dataset.innerContent = "";
                el.style.borderBottom = "none";
                temp.remove();
            }
        }
    });

    const createLink = (link, note) => {
        // Get the selection
        let sel = localIframe.contentWindow.getSelection();
        let str = sel.toString().trim();

        // Make sure we have at least one range
        if (sel.getRangeAt && sel.rangeCount) {
            let ran = sel.getRangeAt(0);
            ran.deleteContents();
            // Add the correct html back
            var frag;
            if (note) {
                frag = ran.createContextualFragment(
                    "<span data-type='link' class='link link-note' oncontextmenu='return false' contenteditable=false data-link=" +
                        link +
                        ">" +
                        str +
                        "</span>"
                );
            } else {
                frag = ran.createContextualFragment(
                    "<a class='link' oncontextmenu='return false' contenteditable=false href='" +
                        link +
                        "'target=_blank >" +
                        str +
                        "</a>"
                );
            }
            ran.insertNode(frag);
            sel.removeAllRanges();
        }
    };

    const noteLinkHandler = () => {
        let sel = localIframe.contentWindow.getSelection();
        let str = sel.toString();
        setLinkState(
            <LinkNotes
                search={str}
                auto={true}
                createLink={createLink}
                closeMenu={closeLinkNoteMenu}
            />
        );
    };

    const hideNoteContext = () => {
        setNoteContextState(null);
    };

    const changeNoteLink = (e) => {
        let range = localIframe.contentDocument.createRange();
        range.selectNodeContents(e);
        let sel = localIframe.contentWindow.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        setLinkState(
            <LinkNotes
                auto={false}
                search={sel.toString()}
                createLink={createLink}
                closeMenu={closeLinkNoteMenu}
            />
        );
    };

    const hideContext = () => {
        setContextState(null);
    };

    const hideCreateLink = () => {
        setCreateLinkState(null);
    };

    const openCreateLink = () => {
        setCreateLinkState(
            <Createlinks
                createLink={createLink}
                hideCreateLink={hideCreateLink}
            />
        );
    };

    const closeLinkNoteMenu = () => {
        setLinkState(null);
    };

    const unlink = (e) => {
        e.replaceWith(e.textContent);
    };

    const mouseHandler = useCallback((e) => {
        if (
            e.target.nodeName === "SPAN" &&
            e.target.classList.contains("link-note")
        ) {
            if (e.button === 0) {
                props.noteToHistory();
                history.push(e.target.dataset.link);
            } else if (e.button === 2) {
                setContextState(null);
                setNoteContextState(
                    <NoteLinkContext
                        changeNoteLink={changeNoteLink}
                        target={e.target}
                        unlink={unlink}
                        hideNoteContext={hideNoteContext}
                    />
                );
                let div = document.getElementById("note-link-context");
                let rect = e.target.getBoundingClientRect();
                let irect = localIframe.getBoundingClientRect();
                div.style.left = (irect.left + rect.left).toString() + "px";
                div.style.top =
                    (e.target.offsetHeight + irect.top + rect.top).toString() +
                    "px";
            }
        } else if (e.target.nodeName === "A" && e.button === 2) {
            e.preventDefault();
            setNoteContextState(null);
            setContextState(
                <LinkContext
                    unlink={unlink}
                    hideContext={hideContext}
                    target={e.target}
                />
            );
            let div = document.getElementById("linkContext");
            let rect = e.target.getBoundingClientRect();
            let irect = localIframe.getBoundingClientRect();
            div.style.left = (irect.left + rect.left).toString() + "px";
            div.style.top =
                (e.target.offsetHeight + irect.top + rect.top).toString() +
                "px";
        } else if (
            e.button === 0 &&
            e.target.nodeName === "INPUT" &&
            e.target.parentNode.dataset.type === "checkbox"
        ) {
            if (!e.target.checked) {
                e.target.parentNode.style["text-decoration"] = "line-through";
                e.target.parentNode.style["color"] = "lightgrey";
            } else {
                e.target.parentNode.style["text-decoration"] = "none";
                e.target.parentNode.style["color"] = "black";
            }
            updateTodoValue(!e.target.checked, e.target.parentNode.id);
        } else {
            setContextState(null);
            setNoteContextState(null);
            setLinkState(null);
            setCreateLinkState(null);
        }
    });

    useEffect(() => {
        localIframe &&
            localIframe.contentDocument.addEventListener(
                "keydown",
                keyHandler,
                false
            );
        localIframe &&
            localIframe.contentDocument.addEventListener(
                "mousedown",
                mouseHandler,
                false
            );
    }, [localIframe, keyHandler, mouseHandler]);

    useEffect(() => {
        return () => {
            localIframe &&
                localIframe.contentDocument.removeEventListener(
                    "keydown",
                    keyHandler,
                    false
                );
            localIframe &&
                localIframe.contentDocument.removeEventListener(
                    "mousedown",
                    mouseHandler,
                    false
                );
        };
    });

    return (
        <div>
            <div className="toolbar">
                {/* undo redo */}
                <div className="sub-container">
                    {
                        <div
                            onClick={() => props.previousNote()}
                            style={{ display: displayBack() ? "flex" : "none" }}
                            className="bar-icon"
                        >
                            <div className="fa fa-angle-double-left"></div>
                        </div>
                    }
                    <div onClick={() => props.undo()} className="bar-icon">
                        <div className="fa fa-undo"></div>
                    </div>
                    <div onClick={() => props.redo()} className="bar-icon">
                        <div className="fa fa-repeat"></div>
                    </div>
                </div>
                {/* font style buttons */}
                <div className="sub-container">
                    <div onClick={() => execCmd("bold")} className="bar-icon">
                        <div className="fa fa-bold"></div>
                    </div>
                    <div onClick={() => execCmd("italic")} className="bar-icon">
                        <div className="fa fa-italic"></div>
                    </div>
                    <div
                        onClick={() => execCmd("underline")}
                        className="bar-icon"
                    >
                        <div className="fa fa-underline"></div>
                    </div>
                </div>
                {/* remove format button */}
                <div className="sub-container">
                    <div
                        onClick={() => execCmd("removeFormat")}
                        className="bar-icon"
                    >
                        <div className="fa fa-remove-format"></div>
                    </div>
                </div>
                {/* font align buttons */}
                <div className="sub-container">
                    <div
                        onClick={() => execCmd("justifyLeft")}
                        className="bar-icon"
                    >
                        <div className="fa fa-align-left"></div>
                    </div>
                    <div
                        onClick={() => execCmd("justifyCenter")}
                        className="bar-icon"
                    >
                        <div className="fa fa-align-center"></div>
                    </div>
                    <div
                        onClick={() => execCmd("justifyRight")}
                        className="bar-icon"
                    >
                        <div className="fa fa-align-right"></div>
                    </div>
                    <div
                        onClick={() => execCmd("justifyFull")}
                        className="bar-icon"
                    >
                        <div className="fa fa-align-justify"></div>
                    </div>
                </div>
                {/* list buttons */}
                <div className="sub-container">
                    {/*
                    <div onClick={insertCheckbox} className="bar-icon">
                        <div className="fa fa-check-square"></div>
                    </div>
                    */}
                    <div
                        onClick={() => execCmd("insertUnorderedList")}
                        className="bar-icon"
                    >
                        <div className="fa fa-list-ul"></div>
                    </div>
                    <div
                        onClick={() => execCmd("insertOrderedList")}
                        className="bar-icon"
                    >
                        <div className="fa fa-list-ol"></div>
                    </div>
                </div>
                {/* indent buttons */}
                <div className="sub-container">
                    <div onClick={() => execCmd("indent")} className="bar-icon">
                        <div className="fa fa-indent"></div>
                    </div>
                    <div
                        onClick={() => execCmd("outdent")}
                        className="bar-icon"
                    >
                        <div className="fa fa-dedent"></div>
                    </div>
                </div>
                {/* add image and link buttons */}
                <div className="sub-container">
                    <div onClick={() => openCreateLink()} className="bar-icon">
                        <div className="fa fa-link"></div>
                    </div>
                    <div
                        onClick={() =>
                            execCmd(
                                "insertImage",
                                prompt("Enter the image URL", "http://")
                            )
                        }
                        className="bar-icon"
                    >
                        <div className="fa fa-file-image-o"></div>
                    </div>
                </div>
                {/* create note link */}
                <div className="sub-container">
                    <div onClick={noteLinkHandler} className="bar-icon">
                        <div className="fas fa-sticky-note"></div>
                    </div>
                </div>
            </div>
            {contextState}
            {noteContextState}
            {linkState}
            {createLinkState}
        </div>
    );
};

export default ToolBar;
