const generateScriptBtn = document.getElementById("generateScriptBtn");
generateScriptBtn.addEventListener("click", exportScript);
const downloadScriptBtn = document.getElementById("downloadScriptBtn");
const copyScriptBtn = document.getElementById("copyScriptBtn");
const defaultScriptFormat = "sourceCoder";
let script;
let itemSize = calculateItemSize();
let equationIndex;
downloadScriptBtn.addEventListener("click", () => {
    download("TINOTES.txt", script);
});
copyScriptBtn.addEventListener("click", () => {
    /* Select the text field */
    document.getElementById("viewer").select();
    /* Copy the text inside the text field */
    document.execCommand("copy");
    swal({
        title: "File Copied!",
        icon: "success",
        buttons: false,
        timer: 800,
    });
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
    changeScriptFormat(defaultScriptFormat);
    const popupBody = document.querySelector('#popup div.modal-body');
    let viewer = document.getElementById("viewer")
    if (viewer) {
        viewer.remove();
    }
    viewer = createFileEditor("viewer");
    viewer.value = script;
    viewer.readOnly = true;
    const scriptFormatSelector = document.getElementById("scriptFormatSelector");
    popupBody.insertBefore(viewer, scriptFormatSelector);

    // file type options
    document.querySelectorAll('input[name="scriptFormat"]')
        .forEach((el) => {
            el.addEventListener("change", (e) => {
                scriptFormat = e.target.value;
                // console.log('TCL: exportScript -> scriptFormat', scriptFormat);
                changeScriptFormat(scriptFormat);
            })
        });


    // process linebreak
    script = script.replace(/\n/g, "\r\n");
}

function changeScriptFormat(scriptFormat) {
    // convert between cemetech's SourceCoder format and TI-BASIC's native format
    const conversionTable = {
        // left is TI-BASIC format (used by TI Connect CE), right is SourceCoder format
        "→": "->",
        "⌊": "|L", // left side should be a small capital "L", but is is technically an unicode "left floor"
        "≠": "!=",
    }
    switch (scriptFormat) {
        case "sourceCoder":
            // console.log('TCL: changeScriptFormat -> scriptFormat', scriptFormat);
            Object.entries(conversionTable).forEach(([key, value]) => {
                // console.log('TCL: changeScriptFormat -> value', value);
                // console.log('TCL: changeScriptFormat -> key', key);
                script = script.replace(new RegExp(escapeRegExp(key), "g"), value);
            })
            script = convertSymbolsToWords(script);
            break;
        case "TIBasic":
            Object.entries(conversionTable).forEach(([key, value]) => {
                // console.log('TCL: changeScriptFormat -> value', value);
                // console.log('TCL: changeScriptFormat -> key', key);
                script = script.replace(new RegExp(escapeRegExp(value), "g"), key);
            })
            script = convertWordsToSymbols(script);
            break;
    }
    // console.log('TCL: changeScriptFormat -> script', script);
    // update the viewer with new script
    let viewer = document.getElementById("viewer");
    if (viewer) {
        viewer.value = script;
    }
}

// source: https://stackoverflow.com/a/3561711/6798201
// Escape all special characters in a regular expression string
function escapeRegExp(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function selectAllItems() {

}

function generateScript() {
    // selectAllItems();
    itemSize = calculateItemSize(); // reset item size
    equationIndex = itemSize;
    script = `0->N\n1->W\nLbl S\n`; // initialize variables
    script += generateScriptHelper("home", 0);
    script += `${baseScript}`;
}

function generateScriptHelper(position, index) {
    // console.log('TCL: generateScriptHelper -> index', index);
    // console.log('TCL: generateScriptHelper -> position', position);
    let homeMenu = `If N=${index}\nThen\nN->|LA(W)\n`;
    homeMenu += `Menu("${getEndOfPosition(position)}"`;
    let branching = ``;
    const indexList = [];
    iterateStorage(function (item, itemName, itemType, itemPosition, index) {
        if (itemPosition === position) {
            index++;
            homeMenu += `,"${getEndOfPosition(itemName)}",${index}`;
            if (itemType === `file`) {
                branching += generateFileScript(index, item.content);
            } else if (itemType === `equation`) {
                branching += generateEquationScript(index, item);
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

function generateEquationScript(index, item){
    const eq = item.equation;
    const vars = item.vars;
	console.log('TCL: generateEquationScript -> vars', vars);
    const varNames = Object.keys(vars);
	console.log('TCL: generateEquationScript -> varNames', varNames);
    const varLength = varNames.length;
	console.log('TCL: generateEquationScript -> varLength', varLength);
    let str = `If N=${index}\nThen\n`;
    // display equation and initiate variables
    str += `Disp "${eq}"\nPause \n${equationIndex - 1}->L\nN->|LA(W)\n`;
    // add menu
    let menu = `Menu("Solve For"`; // start menu
    let conversion = ``;
    let prompt = ``;
    let solution = ``;
    const startIndex = equationIndex;
    const endIndex = equationIndex + varLength;
    for (let label = startIndex; label < endIndex; label++){
        const varName = varNames[label - startIndex];
        const varEquation = vars[varName];
        // add menu item (equation variables)
        menu += `,"${varName}",${label}`;
        // convert menu item's label to number
        conversion += `Lbl ${startIndex - 1 + endIndex - label}:L+1->L\n`;
        // prompt values for known variables
        prompt += `If (L!=${label})\nInput "${varName}=",${varName}\n`;
        // calculate and display the solution
        solution += `If L=${label}\nDisp "${varName}=",${varEquation}\n`;
    }
    menu += `)\n`; // end menu
    // press 2nd key to go back to parent folder
    let back = `Repeat K=21\ngetKey->K\nEnd\nW-1->W\n|LA(W)->N\nGoto S\n`;
    str += menu + conversion + prompt + solution + back;
    str += "End\n" // pause to let user see solution
    // increase equationIndex
    equationIndex += varLength + 1;
    return str;
}

function generateFileScript(index, content){
    return `If N=${index}\n"${content}"->Str1\n`;
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