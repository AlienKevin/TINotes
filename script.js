// set up calculator type
let calculatorType = "color";
// maximum lengths allowed because of screen size limitation
let lineLength, rowLength, menuTitleLength, menuItemLength;
// minimum length required, no empty string
const minMenuItemLength = 1;
const newFolderBtn = document.getElementById("newFolderBtn");
const newFileBtn = document.getElementById("newFileBtn");
const backBtn = document.getElementById("backBtn");
const clearBtn = document.getElementById("clearBtn");
const system = document.getElementById("system");
const navigationBar = document.getElementById("navigationBar");
const homePosition = "home";
let position = homePosition; // default root location for the file system
const itemNameList = [];

// show item navigation bar
displayNavigationBar();

function displayNavigationBar() {
    removeAllChildren(navigationBar);
    console.log('TCL: displayNavigationBar -> position', position);
    const positions = position.split("/");
    for (let i = 0; i < positions.length; i++) {
        createPositionLabel(positions.slice(0, i + 1).join("/"));
    }
}

function removeAllChildren(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createPositionLabel(position) {
    console.log('TCL: createPositionLabel -> position', position);
    const positionLabel = document.createElement("span");
    positionLabel.classList.add("btn");
    positionLabel.classList.add("positionLabel");
    positionLabel.innerHTML = getEndOfPosition(position);
    positionLabel.addEventListener("click", () => {
        setPosition(position);
        console.log('TCL: createPositionLabel -> position', position);
    });
    navigationBar.appendChild(positionLabel);
    positionLabel.insertAdjacentHTML("afterend", `<i class="far fa-angle-right"></i>`);
}

document.querySelector(`input#${calculatorType}`).setAttribute("checked", true);
document.querySelectorAll('input[name="calculatorType"]')
    .forEach((el) => {
        el.addEventListener("change", (e) => {
            calculatorType = e.target.value;
            changeCalculatorType();
            console.log('TCL: e.target', e.target);
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
    if (item.position === homePosition) { // only show ones at home position
        itemNameList.push(itemName);
        displayItem(itemName, type);
    }
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
backBtn.addEventListener("click", () => {
    iterateStorage(function (item, itemName, itemType, itemPosition, index) {
        if (itemName === position) {
            setPosition(itemPosition);
        }
    })
})
clearBtn.addEventListener("click", () => {
    // Based on: https://sweetalert.js.org/guides/#getting-started
    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this folder!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                swal("All items are deleted in this folder", {
                    icon: "success",
                });
                // remove all items in current position (folder)
                itemNameList.forEach(item => {
                    removeItemFromStorage(item);
                });
                // clear the representation of items in the window
                clearAllItems();
            }
        });
});

function toggleBtnHighlight(e) {
    if (e.target.classList.contains("btn")) {
        e.target.classList.toggle("btn-hover");
    }
}

document.addEventListener("mouseover", toggleBtnHighlight)

document.addEventListener("mouseout", toggleBtnHighlight)

function createMenuItem(type, position) {
    type = type.toLowerCase();
    console.log('TCL: createNewMenuItem -> type', type);
    if (type !== "folder" && type !== "file") {
        throw new TypeError(`menu item's type should be either folder or file, not ${type}`);
    }
    const itemNameInput = createItemNameInput(type);
    itemNameInput.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) { // ENTER key
            const itemName = itemNameInput.value;
            if (itemName.length >= minMenuItemLength) {
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
            } else {
                createErrorMessage(itemNameInput, `${type} name can't be empty`);
            }
        }
    });
    system.appendChild(itemNameInput);
    itemNameInput.focus();
}

// Create input box for entering name of the file or folder
function createItemNameInput(type) {
    const itemNameInput = document.createElement("input");
    itemNameInput.setAttribute("type", "text");
    itemNameInput.placeholder = `Enter ${type} name here`;
    // minLength must be detected in ENTER key press event
    itemNameInput.maxLength = menuItemLength;
    itemNameInput.spellcheck = false;
    itemNameInput.classList.add("itemNameInput");
    itemNameInput.style.display = "block";
    itemNameInput.style.marginTop = ".5em";
    itemNameInput.style.marginBottom = ".5em";
    return itemNameInput;
}

function createErrorMessage(target, message) {
    console.log('TCL: createErrorMessage -> target', target);
    console.log('TCL: createErrorMessage -> typeof target', typeof target);
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
    const itemName = `${position}/${itemNameInput.value}`;
    console.log('TCL: storeItem -> itemName', itemName);
    if (type === "file") {
        openFileEditField(itemName, itemInfo);
    } else {
        setItemInStorage(itemName, itemInfo);
    }
    return itemName;
}

// remove all labels of items and delete them in current item name list
// DOES NOT REMOVE FROM STORAGE!!!
function clearAllItems() {
    for (itemName of itemNameList) {
        Array.from(document.getElementsByClassName("item")).forEach(
            (el) => {
                el.remove();
            }
        )
    }
    itemNameList.length = 0; // clear the current item list
}

function appendPosition(newPosition) {
    setPosition(`${position}/${newPosition}`);
}

// set the current position (folder)
function setPosition(newPosition) {
    position = newPosition;
    clearAllItems();
    iterateStorage(function (item, itemName, itemType, itemPosition, index) {
        if (itemPosition === newPosition) {
            itemNameList.push(itemName);
            displayItem(itemName, itemType);
        }
    });
    displayNavigationBar();
}

// retrieve the item name from its full position path
// e.g. itemName = "home/folder1/file1"
// returns "file1"
function getEndOfPosition(itemName) {
    return itemName.substring(itemName.lastIndexOf("/") + 1);
}

// display item labels
function displayItem(itemName, type, itemPosition) {
    // replace input with label
    const newItem = document.createElement("p");
    const displayedName = getEndOfPosition(itemName);
    if (type === "file") {
        newItem.innerHTML = `📝${displayedName}`;
    } else {
        newItem.innerHTML = `📁${displayedName}`;
    }
    newItem.classList.add(type);
    newItem.classList.add("btn");
    newItem.classList.add("item");
    newItem.setAttribute("data-name", itemName);
    newItem.addEventListener("click", () => {
        if (type === "file") {
            const itemInfo = getItemFromStorage(itemName);
            displayFile(newItem, itemName, itemInfo);
        } else {
            // set item location to the folder
            console.log('TCL: displayItem -> position', position);
            if (getItemFromStorage(itemName)) {
                setPosition(itemName);
            } else {
                appendPosition(itemName);
            }
            console.log('TCL: displayItem -> position', position);
        }
    });
    // console.log("displaying item...");
    if (itemPosition) {
        console.log('TCL: displayItem -> position', itemPosition);
        insertAfter(itemPosition, newItem);
    } else {
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
    const editField = document.getElementById("editField");
    if (editField) {
        editField.remove();
        const clickedItemName = editField.getAttribute("data-item");
        if (clickedItemName !== fileName) { // not the same file
            displayFile(position, fileName, fileInfo);
        }
    } else {
        openFileEditField(fileName, fileInfo, position);
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
        console.log('TCL: renameItem -> itemLabel', itemLabel);
        console.log('TCL: renameItem -> itemLabel.parentNode', itemLabel.parentNode);
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

function renameItemInStorage(oldItemName, newItemName) {
    const item = getItemFromStorage(oldItemName);
    removeItemFromStorage(oldItemName);
    setItemInStorage(newItemName, item);
}

function removeItemFromStorage(itemName) {
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
function replaceElementInArray(array, oldElement, newElement) {
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

function openFileEditField(itemName, itemInfo, position) {
    const editor = createFileEditor();
    editor.placeholder = "Write notes here"
    if (itemInfo.content !== undefined) {
        editor.value = convertSpacesToNewlines(itemInfo.content);
        editor.setAttribute("data-item", itemName);
    }
    editor.addEventListener("input", () => {
        const content = editor.value.replace(/\n/g, "");
        console.log('TCL: openFileEditField -> content.length', content.length);
        if ((content.length - 1) % lineLength === 0 && content.length - 1 !== 0) {
            editor.value = insertString(editor.value, editor.value.length - 1, "\n", 0); // avoid word wrapping
        }
        // editor.value = editor.value.replace(/([\s\S]{80})/g, "$1\n");
    });
    const submitBtn = document.createElement("span");
    submitBtn.id = "submitFileBtn";
    submitBtn.classList.add("btn");
    submitBtn.innerHTML = "Submit";
    submitBtn.addEventListener("click", () => {
        // return file content
        console.log("converting newlines to spaces");
        editor.value = convertNewlinesToSpaces(editor.value);
        itemInfo.content = editor.value;
        setItemInStorage(itemName, itemInfo);
        editField.remove();
    });
    const editField = document.createElement("div");
    editField.id = "editField";
    editField.setAttribute("data-item", itemName);
    if (position === undefined) {
        system.appendChild(editField);
    } else {
        insertAfter(position, editField);
    }
    editField.appendChild(editor);
    editField.appendChild(submitBtn);
    editor.focus();
}

function convertNewlinesToSpaces(inputStr) {
    let str = inputStr;
    let previousNewlineIndex = 0;
    let newlineIndex = str.indexOf("\n");
    // substitute newlines with spaces
    while (newlineIndex >= 0 && previousNewlineIndex < str.length) {
        newlineIndex = str.indexOf("\n", previousNewlineIndex);
        if (newlineIndex < 0) {
            break;
        }
        console.log('newlineIndex:' + newlineIndex);
        const numOfSpaces = lineLength - (newlineIndex - previousNewlineIndex);
        let spaces = "";
        for (let i = 0; i < numOfSpaces; i++) {
            spaces += " ";
        }
        str = str.slice(0, newlineIndex) + spaces + str.slice(newlineIndex + 1);
        // str = insertString(str, newlineIndex, spaces, 1);
        console.log("str: " + str);
        previousNewlineIndex = newlineIndex + numOfSpaces;
        console.log("previousNewlineIndex: " + previousNewlineIndex)
    }
    return str;
}

function convertSpacesToNewlines(inputStr) {
    let str = inputStr;
    let index = lineLength - 1;
    while (index < str.length) {
        if (str[index] === " ") {
            str = insertString(str, index, "", 1);
            index--;
        } else {
            str = insertString(str, index + 1, "\n", 0);
            index += lineLength + 1;
        }
    }
    return str;
}

function insertString(str, index, insertedString, deleteLength = 0) {
    return str.slice(0, index) + insertedString + str.slice(index + deleteLength);
}