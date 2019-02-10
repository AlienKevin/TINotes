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
    script = `0->N\n1->W\nLbl S\n`; // initialize variables
    script += generateScriptHelper("home", 0, 0);
    script += `${baseScript}`;
}

function generateScriptHelper(position, index, label) {
    console.log('TCL: generateScriptHelper -> index', index);
    console.log('TCL: generateScriptHelper -> position', position);
    let homeMenu;
    if (index === 0) {
        homeMenu = `If N=0\nThen\nN->|LA(W)\n0->N\n`;
    } else {
        homeMenu = `If N=${index - 1}\nThen\nN->|LA(W)\n${label}->N\n`;
    }
    homeMenu += `Menu("${getEndOfPosition(position)}"`;
    let branching = ``;
    index++;
    const oldIndex = index;
    iterateStorage(function (item, itemName, itemType, itemPosition) {
        if (itemPosition === position) {
            homeMenu += `,"${getEndOfPosition(itemName)}",${index}`;
            index++;
            if (itemType === `file`) {
                branching += `If N=${index-1}\n`;
                branching += `"${item.content}"->Str1\n`;
            } else {
                menuLength = 0;
                iterateStorage(function (item, itemName, itemType, itemPosition) {
                    if (itemPosition === position) {
                        menuLength++;
                    }
                    console.log('TCL: generateScriptHelper -> position', position);
                    console.log('TCL: generateScriptHelper -> menuLength', menuLength);
                });
                label += menuLength;
                branching += generateScriptHelper(itemName, index, label);
            }
        }
    });
    let startIndex;
    if (position !== "home") {
        homeMenu += `,"BACK",${index}`; // create back button
        homeMenu += `)\n`;
        homeMenu += `Lbl ${index}:\n`;
        homeMenu += `|LA(W-1)->N\nGoto S\n`;
        startIndex = index - 1;
    } else {
        homeMenu += `)\n`;
        startIndex = index - 1;
    }
    for (let i = startIndex; i >= oldIndex; i--) {
        homeMenu += `Lbl ${i}:N+1->N\n`;
    }
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