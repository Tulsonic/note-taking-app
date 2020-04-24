import React, { useState, useEffect, useCallback } from "react";

const ToolBar = (props) => {
    const [localIframe, setLocalIframe] = useState(null);
    const [editable, setEditable] = useState(true);

    const { iframe } = props;

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

    const getActiveDiv = () => {
        var sel = localIframe.contentDocument.getSelection();
        var range = sel.getRangeAt(0);
        var node = localIframe.contentDocument.createElement("span");
        range.insertNode(node);
        range = range.cloneRange();
        range.selectNodeContents(node);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        var activeDiv = node.parentNode;
        node.parentNode.removeChild(node);
        return activeDiv;
    };

    const tabHandler = useCallback((e) => {
        if (e.key === "Tab" && getActiveDiv().tagName === "LI") {
            e.preventDefault();
            execCmd("indent");
        }
        if (e.ctrlKey && e.key === "l") {
            e.preventDefault();
            execCmd("insertUnorderedList");
        }
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            saveHandler();
        }
    });

    useEffect(() => {
        localIframe &&
            localIframe.contentDocument.addEventListener(
                "keydown",
                tabHandler,
                false
            );
    }, [localIframe, tabHandler]);

    const insertCheckbox = () => {
        var sel, range;
        if (
            localIframe.contentWindow.getSelection &&
            (sel = localIframe.contentWindow.getSelection()).rangeCount
        ) {
            range = sel.getRangeAt(0);
            range.collapse(true);
            var checkbox = localIframe.contentDocument.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = true;
            range.insertNode(checkbox);

            // Move the caret immediately after the inserted span
            range.setStartAfter(checkbox);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const saveHandler = () => {
        const content = localIframe.contentWindow.document.body.innerHTML;
        props.saveContentCallback(content);
    };

    const toggleEditHandler = () => {
        setEditable(!editable);
        if (!editable) {
            localIframe.contentDocument.designMode = "on";
        } else {
            localIframe.contentDocument.designMode = "off";
        }
    };

    return (
        <div className="toolbar">
            {/* toggle edit */}
            <div className="sub-container">
                {editable ? (
                    <div
                        onClick={toggleEditHandler}
                        className="bar-icon active"
                    >
                        <div className="fa fa-edit"></div>
                    </div>
                ) : (
                    <div onClick={toggleEditHandler} className="bar-icon ">
                        <div className="fa fa-edit"></div>
                    </div>
                )}
            </div>
            {/* save */}
            <div className="sub-container">
                <div onClick={saveHandler} className="bar-icon">
                    <div className="fa fa-save"></div>
                </div>
            </div>
            {/* undo redo */}
            <div className="sub-container">
                <div onClick={() => execCmd("undo")} className="bar-icon">
                    <div className="fa fa-undo"></div>
                </div>
                <div onClick={() => execCmd("redo")} className="bar-icon">
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
                <div onClick={() => execCmd("underline")} className="bar-icon">
                    <div className="fa fa-underline"></div>
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
                <div onClick={() => execCmd("outdent")} className="bar-icon">
                    <div className="fa fa-dedent"></div>
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
            {/* add image and link buttons */}
            <div className="sub-container">
                <div
                    onClick={() =>
                        execCmd("createLink", prompt("Enter a URL", "http://"))
                    }
                    className="bar-icon"
                >
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
        </div>
    );
};

export default ToolBar;
