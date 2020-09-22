import React, { useEffect, useState } from "react";

function TextEditor(props) {
    const { content, iframeCallback } = props;

    const [textEditor, setTextEditor] = useState(null);

    useEffect(() => {
        let te = document.getElementById("textEditor");
        te.contentWindow.onload = () => {
            te.contentWindow.document.body.innerHTML = content;
            te.contentDocument.designMode = "on";
            te.contentWindow.document.body.spellcheck = false;
            setTextEditor(te);
            te.contentDocument
                .getElementsByTagName("HTML")[0]
                .classList.add("text-editor-html");
        };
    }, [content]);

    if (textEditor && textEditor !== null) {
        iframeCallback(textEditor);
    }

    return (
        <iframe
            src={process.env.PUBLIC_URL + "/textEditor/iframe.html"}
            title="text-editor"
            id="textEditor"
            className="text-editor"
        ></iframe>
    );
}

export default TextEditor;
