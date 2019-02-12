const generateScriptBtn = document.getElementById("generateScriptBtn");
generateScriptBtn.addEventListener("click", exportScript);
const downloadScriptBtn = document.getElementById("downloadScriptBtn");
let script;
let itemSize = calculateItemSize();
downloadScriptBtn.addEventListener("click", () => {
    download("TINOTES.txt", script);
});

function calculateItemSize() {
    let itemSize = 0;
    iterateStorage(function () {
        itemSize++;
    });
    itemSize++;
    return itemSize;
}

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
    itemSize = calculateItemSize(); // reset item size
    script = `0->N\n1->W\nLbl S\n`; // initialize variables
    script += generateScriptHelper("home", 0);
    script += `${baseScript}`;
}

function generateScriptHelper(position, index) {
    console.log('TCL: generateScriptHelper -> index', index);
    console.log('TCL: generateScriptHelper -> position', position);
    let homeMenu = `If N=${index}\nThen\nN->|LA(W)\n`;
    homeMenu += `Menu("${getEndOfPosition(position)}"`;
    let branching = ``;
    const indexList = [];
    iterateStorage(function (item, itemName, itemType, itemPosition, index) {
        if (itemPosition === position) {
            index++;
            homeMenu += `,"${getEndOfPosition(itemName)}",${index}`;
            if (itemType === `file`) {
                branching += `If N=${index}\n`;
                branching += `"${item.content}"->Str1\n`;
            } else {
                branching += generateScriptHelper(itemName, index);
            }
            indexList.push(index);
        }
    });
    if (position !== "home") { // not at home position
        homeMenu += `,"Back",${itemSize}`;
        homeMenu += `)\n`;
        homeMenu += `Lbl ${itemSize}\n`;
        homeMenu += `W-1->W\n|LA(W)->N\nGoto S\n`;
        itemSize++;
    } else { // at home position
        homeMenu += `)\n`;
    }
    indexList.forEach(
        (index, len) => {
            homeMenu += `Lbl ${index}\n`;
            if (len > 0) {
                homeMenu += `If `;
                for (let i = 0; i < len; i++) {
                    if (i > 0) {
                        homeMenu += ` and `;
                    }
                    homeMenu += `N!=${indexList[i]}`;
                }
                homeMenu += `\n`;
            }
            homeMenu += `${index}->N\n`;
        }
    )
    homeMenu += `W+1->W\nEnd\n`;
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