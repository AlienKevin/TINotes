// set up calculator type
let calculatorType = "color";
let lineLength, rowLength, menuTitleLength, menuItemLength;
const newFolderBtn = document.getElementById("newFolderBtn");
const newFileBtn = document.getElementById("newFileBtn");
const system = document.getElementById("system");
let position = "home"; // default root location for the file system
const itemNameList = [];

document.querySelector(`input#${calculatorType}`).setAttribute("checked", true);
document.querySelectorAll('input[name="calculatorType"]')
    .forEach((el) => {
        el.addEventListener("change", (e) => {
            calculatorType = e.target.value;
            changeCalculatorType();
			// // console.log('TCL: e.target', e.target);
        })
    });

changeCalculatorType();

function changeCalculatorType() {
    // set up variables for different calculators
    switch (calculatorType) {
        case "monochrome": // e.g. TI-83
            lineLength = 16;
            rowLength = 8;
            break;
        case "color": // e.g. TI-84/CSE/CE
            lineLength = 26;
            rowLength = 10;
            break;
    }
    menuTitleLength = lineLength;
    menuItemLength = lineLength - 2;
}

newFolderBtn.addEventListener("click", () => {
    createMenuItem("folder", position)
});
newFileBtn.addEventListener("click", () => {
    createMenuItem("file", position)
});

function toggleBtnHighlight(e) {
    if (e.target.classList.contains("btn")) {
		// console.log('TCL: toggleBtnHighlight -> e.target', e.target);
        e.target.classList.toggle("btn-hover");
    }
}

document.addEventListener("mouseover", toggleBtnHighlight)

document.addEventListener("mouseout", toggleBtnHighlight)

function createMenuItem(type, position) {
    type = type.toLowerCase();
	// // console.log('TCL: createNewMenuItem -> type', type);
    if (type !== "folder" && type !== "file") {
        throw new TypeError(`menu item's type should be either folder or file, not ${type}`);
    }
    let newItem = document.createElement("input");
    newItem.setAttribute("type", "text");
    newItem.placeholder = `Enter ${type} name here`;
    newItem.minLength = 1;
    newItem.maxLength = menuItemLength;
    newItem.spellcheck = false;
    newItem.classList.add("itemNameInput");
    newItem.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) { // ENTER key
            const itemName = newItem.value;
            if (itemNameList.indexOf(itemName) >= 0) { // repeated name
                createErrorMessage(newItem,
                    `Duplicated ${type} name, ${type} name must be unique`);
            } else {
                itemNameList.push(itemName);
                displayItem(itemName, type);
                storeItem(newItem, type, position);
            }
        }
    });
    system.appendChild(newItem);
    newItem.focus();
}

function createErrorMessage(target, message) {
	// // console.log('TCL: createErrorMessage -> target', target);
	// // console.log('TCL: createErrorMessage -> typeof target', typeof target);
    // delete all previous error message
    document.querySelectorAll(".error").forEach(
        el => {
            el.remove();
        }
    )
    const popup = document.createElement("span");
    popup.innerHTML = message;
    popup.classList.add("error");
    target.addEventListener("input", () => {
        popup.remove(); // delete itself when new input appears
    });
    insertAfter(target, popup);
}

function storeItem(newItem, type, position) {
    // store new item with the inputed name
    const itemInfo = {
        "position": position,
        "type": type
    };
    const itemName = newItem.value;
    if (type === "file") {
        openFileEditor(itemName, itemInfo);
    } else {
        localStorage.setItem(itemName, JSON.stringify(itemInfo));
    }
    // remove item name input
    newItem.remove();
    return itemName;
}

function displayItem(itemName, type) {
    // replace input with label
    const newItem = document.createElement("p");
    if (type === "file") {
        newItem.innerHTML = `📝${itemName}`;
    } else {
        newItem.innerHTML = `📁${itemName}`;
    }
    newItem.classList.add(type);
    newItem.classList.add("btn");
    newItem.addEventListener("click", () => {
        if (type === "file") {
            const itemInfo = JSON.parse(localStorage.getItem(itemName));
            displayFile(newItem, itemName, itemInfo);
        }
    });
    system.appendChild(newItem);
}

function createFileEditor() {
    const editor = document.createElement("textarea");
    editor.id = "editor";
    editor.rows = rowLength;
    editor.cols = lineLength;
    editor.spellcheck = false;
    return editor;
}

function displayFile(position, fileName, fileInfo) {
    // toggle file editor
    const editor = document.getElementById("editor");
    if (editor) {
        editor.remove();
        const submitBtn = document.getElementById("submitFileBtn");
        submitBtn.remove();
        const clickedItemName = editor.getAttribute("data-item");
        if (clickedItemName !== fileName) { // not the same file
            displayFile(position, fileName, fileInfo);
        }
    } else {
        openFileEditor(fileName, fileInfo, position);
    }
}
// source: https://stackoverflow.com/a/4793630/6798201
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function openFileEditor(itemName, itemInfo, position) {
    const editor = createFileEditor();
    editor.placeholder = "Write notes here"
    if (itemInfo.content !== undefined) {
        editor.value = itemInfo.content;
        editor.setAttribute("data-item", itemName);
    }
    editor.addEventListener("keypress", (e) => {
        const content = editor.value.replace(/\n/g, "");
        const leftInRow = lineLength - content.length % (lineLength);
        if (e.keyCode == 13) { // ENTER key
            e.preventDefault(); // no linebreak allowed in file
			// // console.log('TCL: openFileEditor -> leftInRow', leftInRow);
            let spaces = "";
            for (let i = 0; i < leftInRow; i++) {
                spaces += " ";
            }
            editor.value += spaces + "\n";
        }
        if (leftInRow === lineLength && content.length !== 0) {
			// // console.log('TCL: openFileEditor -> leftInRow', leftInRow);
            editor.value += "\n"; // avoid word wrapping
        }
    });
    const submitBtn = document.createElement("span");
    submitBtn.id = "submitFileBtn";
    submitBtn.classList.add("btn");
    submitBtn.innerHTML = "Submit";
    submitBtn.addEventListener("click", () => {
        // return file content
        itemInfo.content = editor.value.replace(/\n/g, "");
        localStorage.setItem(itemName, JSON.stringify(itemInfo));
        editor.remove();
        submitBtn.remove();
    });
    if (position === undefined) {
        system.appendChild(editor);
        system.appendChild(submitBtn);
    } else {
        insertAfter(position, submitBtn);
        insertAfter(position, editor);
    }
    editor.focus();
}