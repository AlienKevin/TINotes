const generateScriptBtn = document.getElementById("generateScriptBtn");
generateScriptBtn.addEventListener("click", exportScript);
const downloadScriptBtn = document.getElementById("downloadScriptBtn");
let script;
downloadScriptBtn.addEventListener("click", () => {
    download("TINOTES.txt", script);
});

function exportScript() {
    generateScript();
    const popupBody = document.querySelector('#popup div.modal-body');
    let viewer = document.getElementById("viewer")
    if (viewer) {
        viewer.remove();
    }
    viewer = createFileEditor("viewer");
    viewer.value = script;
    viewer.readOnly = true;
    popupBody.appendChild(viewer);
    // process linebreak
    script = script.replace(/\n/g, "\r\n");
}

function selectAllItems() {

}

function generateScript() {
    // selectAllItems();
    script = generateScriptHelper("home");
    script += `Lbl 0\n${baseScript}`;
}

function generateScriptHelper(position) {
    let homeMenu = `Menu("${getEndOfPosition(position)}"`;
    let branching = ``;
    iterateStorage(function (item, itemName, itemType, itemPosition, index) {
        if (itemPosition === position) {
            index += 1;
            homeMenu += `,"${getEndOfPosition(itemName)}",${index}`;
            branching += `Lbl ${index}\n`;
            if (itemType === `file`) {
                branching += `"${item.content}"→Str1\n`;
                branching += `Goto 0\n`;
            } else {
                branching += generateScriptHelper(itemName);
            }
        }
    });
    homeMenu += `)`;
    script = `${homeMenu}\n${branching}`;
    return script;
}





// Source: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
// Start downloading a file in browser
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}