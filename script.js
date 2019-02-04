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
			// console.log('TCL: e.target', e.target);
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
// load items from last time in localStorage
iterateStorage(function (item, itemName, type) {
    itemNameList.push(itemName);
    displayItem(itemName, type);
});

function iterateStorage(func) {
    for (let index = 0; index < localStorage.length; index++) {
        const itemName = localStorage.key(index);
        const item = getItemFromStorage(itemName);
        func(item, itemName, item.type, item.position, index);
    }
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
	// console.log('TCL: createNewMenuItem -> type', type);
    if (type !== "folder" && type !== "file") {
        throw new TypeError(`menu item's type should be either folder or file, not ${type}`);
    }
    const itemNameInput = createItemNameInput(type);
    itemNameInput.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) { // ENTER key
            const itemName = itemNameInput.value;
            if (itemNameList.indexOf(itemName) >= 0) { // repeated name
                createErrorMessage(itemNameInput,
                    `Duplicated ${type} name, ${type} name must be unique`);
            } else {
                itemNameList.push(itemName);
                displayItem(itemName, type, itemNameInput);
                storeItem(itemNameInput, type, position);
                // remove item name input
                itemNameInput.remove();
            }
        }
    });
    system.appendChild(itemNameInput);
    itemNameInput.focus();
}

// Create input box for entering name of the file or folder
function createItemNameInput(type){
    const itemNameInput = document.createElement("input");
    itemNameInput.setAttribute("type", "text");
    itemNameInput.placeholder = `Enter ${type} name here`;
    itemNameInput.minLength = 1;
    itemNameInput.maxLength = menuItemLength;
    itemNameInput.spellcheck = false;
    itemNameInput.classList.add("itemNameInput");
    itemNameInput.style.display = "block";
    itemNameInput.style.marginTop = ".5em";
    itemNameInput.style.marginBottom = ".5em";
    return itemNameInput;
}

function createErrorMessage(target, message) {
	// console.log('TCL: createErrorMessage -> target', target);
	// console.log('TCL: createErrorMessage -> typeof target', typeof target);
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

function storeItem(itemNameInput, type, position) {
    // store new item with the inputed name
    const itemInfo = {
        "position": position,
        "type": type
    };
    const itemName = itemNameInput.value;
    if (type === "file") {
        openFileEditor(itemName, itemInfo);
    } else {
        setItemInStorage(itemName, itemInfo);
    }
    return itemName;
}

function displayItem(itemName, type, position) {
    // replace input with label
    const newItem = document.createElement("p");
    if (type === "file") {
        newItem.innerHTML = `📝${itemName}`;
    } else {
        newItem.innerHTML = `📁${itemName}`;
    }
    newItem.classList.add(type);
    newItem.classList.add("btn");
    newItem.classList.add("item");
    newItem.setAttribute("data-name", itemName);
    newItem.addEventListener("click", () => {
        if (type === "file") {
            const itemInfo = getItemFromStorage(itemName);
            displayFile(newItem, itemName, itemInfo);
        }
    });
    // console.log("displaying item...");
    if (position){
		// console.log('TCL: displayItem -> position', position);
        insertAfter(position, newItem);
    } else{
        system.appendChild(newItem);
    }
}

function createFileEditor(id) {
    const editor = document.createElement("textarea");
    if (id) {
        editor.id = id;
    } else {
        editor.id = "editor";
    }
    editor.classList.add("editor");
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

function deleteItem(itemLabel) {
    const itemName = itemLabel.getAttribute("data-name");
    if (itemName) {
        removeItemFromStorage(itemName);
        removeElementInArray(itemNameList, itemName);
    }
    itemLabel.remove();
}

function renameItem(itemLabel) {
    const oldItemName = itemLabel.getAttribute("data-name");
    if (oldItemName) {
        const item = getItemFromStorage(oldItemName);
        const type = item.type;
        const itemNameInput = createItemNameInput();
        itemNameInput.value = oldItemName;
        insertAfter(itemLabel, itemNameInput);
        itemNameInput.focus();
		// console.log('TCL: renameItem -> itemLabel', itemLabel);
		// console.log('TCL: renameItem -> itemLabel.parentNode', itemLabel.parentNode);
        itemLabel.remove();
        itemNameInput.addEventListener("keypress", (e) => {
            if (e.keyCode == 13) { // ENTER key
                const newItemName = itemNameInput.value;
                if (itemNameList.indexOf(newItemName) >= 0 && newItemName !== oldItemName) { // repeated name
                    createErrorMessage(itemNameInput,
                        `Duplicated ${type} name, ${type} name must be unique`);
                } else {
                    replaceElementInArray(itemNameList, oldItemName, newItemName);
                    renameItemInStorage(oldItemName, newItemName);
                    displayItem(newItemName, type, itemNameInput);
                    // remove item name input
                    itemNameInput.remove();
                }
            }
        })
    }
}

function renameItemInStorage(oldItemName, newItemName){
    const item = getItemFromStorage(oldItemName);
    removeItemFromStorage(oldItemName);
    setItemInStorage(newItemName, item);
}

function removeItemFromStorage(itemName){
    localStorage.removeItem(itemName);
}

function getItemFromStorage(itemName) {
    return JSON.parse(localStorage.getItem(itemName));
}

function setItemInStorage(itemName, item) {
    localStorage.setItem(itemName, JSON.stringify(item));
}

// Source: https://stackoverflow.com/a/9792947/6798201
// Remove one element in array, only remove
// the first occurance starting from the end of the array
// uncomment break to remove all occurance
function removeElementInArray(array, element) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === element) {
            array.splice(i, 1);
            break;
        }
    }
}

// Based on: https://stackoverflow.com/a/9792947/6798201
// Replace one element in array with new element, only replace 
// the first occurance starting from the end of the array
// uncomment break to replace all occurance
function replaceElementInArray(array, oldElement, newElement){
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === oldElement) {
            array.splice(i, 1, newElement);
            break;
        }
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
			// console.log('TCL: openFileEditor -> leftInRow', leftInRow);
            let spaces = "";
            for (let i = 0; i < leftInRow; i++) {
                spaces += " ";
            }
            editor.value += spaces + "\n";
        }
        if (leftInRow === lineLength && content.length !== 0) {
			// console.log('TCL: openFileEditor -> leftInRow', leftInRow);
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
        setItemInStorage(itemName, itemInfo);
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