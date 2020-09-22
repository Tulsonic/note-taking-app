function addTextEditor(el) {
    let modeVal = el.parentNode.firstChild.textContent;
    //let hc = document.head.childNodes;
    //for (let i = 0; i <= hc.length; i++) {
    //let el = hc[i];
    //if (i < hc.length) {
    //if (el.nodeName === "SCRIPT") {
    //let arr = el.src.split("/");
    //if (arr[arr.length - 2] === modeVal) {
    //break;
    //}
    //}
    //} else {
    //let nScr = document.createElement("script");
    //nScr.src = `/textEditor/js/codemirror/mode/${modeVal}/${modeVal}.js`;
    //document.head.appendChild(nScr);
    //break;
    //}
    //}
    let cm = CodeMirror.fromTextArea(el, {
        lineNumbers: true,
        theme: "dracula",
        mode: modeVal,
        viewportMargin: 20
    });
    let pDiv = el.nextSibling;
    let nEl = document.createElement("div");
    pDiv.insertBefore(nEl, pDiv.firstChild);
    let nElStr = `
<select onchange="onSelectChange(this)">
  <option value="javascript">Javascript</option>
  <option value="jsx">JSX</option>
  <option value="xml">XML</option>
  <option value="shell">Shell</option>
  <option value="python">Python</option>
  <option value="go">GO</option>
  <option value="clike">C-like</option>
</select>
    `;
    nEl.outerHTML = nElStr;
    let selEl = pDiv.childNodes[1];
    let op = selEl.options;
    for (let i = 0; i < op.length; i++) {
        let ops = op[i];
        if (ops.value === modeVal) {
            selEl.selectedIndex = i;
        }
    }
}

function onSelectChange(a) {
    let hc = document.head.childNodes;
    let val = a.options[a.selectedIndex].value;
    //for (let i = 0; i <= hc.length; i++) {
    //let el = hc[i];
    //if (i < hc.length) {
    //if (el.nodeName === "SCRIPT") {
    //let arr = el.src.split("/");
    //if (arr[arr.length - 2] === val) {
    //break;
    //}
    //}
    //} else {
    //let nScr = document.createElement("script");
    //nScr.src = `/textEditor/js/codemirror/mode/${val}/${val}.js`;
    //document.head.appendChild(nScr);
    //break;
    //}
    //}
    a.parentNode.parentNode.firstChild.textContent = val;
    let el = a.parentNode.CodeMirror;
    el.setOption("mode", val);
}

function getValue(el) {
    let val = el.childNodes[2].CodeMirror.getValue();
    el.childNodes[1].textContent = val;
}
