import React, { useEffect, useState } from "react";

function TextEditor(props) {
    const { content } = props;
    const [textEditor, setTextEditor] = useState(null);
    const [localContent, setLocalContent] = useState(null);

    useEffect(() => {
        setTextEditor(document.getElementById("textEditor"));
        return () => {
            setLocalContent(null);
        };
    }, []);

    useEffect(() => {
        setLocalContent(content);
    }, [content]);

    if (
        localContent &&
        localContent !== null &&
        textEditor.contentWindow.document.body.innerHTML === ""
    ) {
        textEditor.contentWindow.document.body.innerHTML = localContent;
    }

    if (textEditor && textEditor !== null) {
        textEditor.contentDocument.designMode = "on";
        const base = textEditor.contentDocument.createElement("base");
        base.target = "_blank";
        textEditor.contentDocument.head.appendChild(base);
        const link = textEditor.contentDocument.createElement("link");
        link.href = "/textEditor/textEditor.css";
        link.rel = "stylesheet";
        link.type = "text/css";
        textEditor.contentDocument.head.appendChild(link);
        textEditor.contentDocument.body.style.fontFamily = "Roboto";
        textEditor.contentDocument
            .getElementsByTagName("HTML")[0]
            .classList.add("text-editor-html");
        props.iframeCallback(textEditor);
    }

    const execCmd = (cmd, args) => {
        if (args) {
            textEditor.contentDocument.execCommand(cmd, false, args);
        } else {
            textEditor.contentDocument.execCommand(cmd, false, null);
        }
        textEditor.contentDocument.getElementsByTagName("body")[0].focus();
    };

    return (
        <iframe
            title="text-editor"
            id="textEditor"
            className="text-editor"
        ></iframe>
    );
}

export default TextEditor;
