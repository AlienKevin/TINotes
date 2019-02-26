// set up calculator type
let calculatorType = "color";
// maximum lengths allowed because of screen size limitation
let
    lineLength, rowLength, menuTitleLength, menuItemLength;
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
// valid types of note items
const types = ["file", "folder", "equation"];
let defaultToUppercase = true; // default auto convert to uppercase
let lastFileContent = ""; // file editor's previous content
const conversionTable = {
    // greek letters
    alpha: "α",
    beta: "β",
    gamma: "γ",
    Delta: "Δ",
    delta: "δ",
    epsilon: "ε",
    pi: "π",
    lambda: "λ",
    mu: "μ",
    Omega: "Ω",
    phat: "p̂",
    Phi: "Φ",
    rho: "ρ",
    Sigma: "Σ",
    sigma: "σ",
    tau: "τ",

    // other symbols
    "sqrt(": "√(",
    "integral": "∫",
    "<=": "≤",
    ">=": "≥",
    "!=": "≠",
}

// show item navigation bar
displayNavigationBar();

// manage calculator type selection
changeCalculatorType();

document.querySelector(`input#${calculatorType}`).setAttribute("checked", true);
document.querySelectorAll('input[name="calculatorType"]')
    .forEach((el) => {
        el.addEventListener("change", (e) => {
            calculatorType = e.target.value;
            changeCalculatorType();
            // console.log('TCL: e.target', e.target);
        })
    });

// load items from last time in localStorage
updateAtPosition(homePosition);

function updateAtPosition(currentPosition) {
    iterateStorage(function (item, itemName, itemType) {
        // console.log('TCL: updateAtPosition -> item', item);
        if (item.position === currentPosition) { // only show ones at home position
            itemNameList.push(itemName);
            displayItem(itemName, itemType);
            updateItemSize(itemName);
        }
    });
}

// Display file/folder placeholder (hint) in case home folder is empty
displayItemPlaceholder();

// set up buttons

// button for creating a new folder
newFolderBtn.addEventListener("click", () => {
    createMenuItem("folder");
});
Mousetrap.bind("shift+f", (e) => { // keyboard shortcut
    newFolderBtn.click();
    return false; // prevent event's default behavior
});

// button for creating a new file
newFileBtn.addEventListener("click", () => {
    createMenuItem("file");
});
Mousetrap.bind("shift+t", (e) => { // keyboard shortcut
    newFileBtn.click();
    return false;
});

// moving back to parent folder
backBtn.addEventListener("click", () => {
    iterateStorage(function (item, itemName, itemType, itemPosition, index) {
        if (itemName === position) {
            setPosition(itemPosition);
        }
    })
})
Mousetrap.bind("backspace", () => {
    backBtn.click();
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
                    buttons: false,
                    timer: 800,
                });
                // remove all items in current position (folder)
                // itemNameList.forEach(item => {
                //     removeItemFromStorage(item);
                // });
                // console.log('TCL: position', position);
                const removeItemList = [];
                iterateStorage(function (item, itemName, itemType, itemPosition, index) {
                    // console.log('TCL: itemPosition', itemPosition);
                    // console.log('TCL: itemName', itemName);
                    if (itemPosition.startsWith(position)) {
                        removeItemList.push(itemName);
                    }
                });
                removeItemList.forEach((item) => {
                    removeItemFromStorage(item)
                });
                // clear the representation of items in the window
                clearAllItems();
                displayItemPlaceholder(); // show placeholder
            }
        });
});

function displayNavigationBar() {
    removeAllChildren(navigationBar);
    // console.log('TCL: displayNavigationBar -> position', position);
    const positions = position.split("/");
    for (let i = 0; i < positions.length; i++) {
        createPositionLabel(positions.slice(0, i + 1).join("/"));
    }
}

function createPositionLabel(position) {
    // console.log('TCL: createPositionLabel -> position', position);
    const positionLabel = document.createElement("span");
    positionLabel.classList.add("btn");
    positionLabel.classList.add("positionLabel");
    positionLabel.innerHTML = getEndOfPosition(position);
    positionLabel.addEventListener("click", () => {
        setPosition(position);
        // console.log('TCL: createPositionLabel -> position', position);
    });
    navigationBar.appendChild(positionLabel);
    positionLabel.insertAdjacentHTML("afterend", `<i class="far fa-angle-right"></i>`);
}

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

function removeItemPlaceholder() {
    let placeholder = document.getElementById("newItemPlaceholder");
    if (placeholder) { // remove previous placeholder
        placeholder.remove();
    }
}

function displayItemPlaceholder() {
    removeItemPlaceholder();
    if (itemNameList.length === 0) {
        const placeholder = document.createElement("p");
        placeholder.id = "newItemPlaceholder";
        placeholder.classList.add("btn");
        placeholder.innerHTML = "Create a New File or Folder";
        placeholder.addEventListener("click", () => {
            swal({
                    title: "Create a file or folder?",
                    buttons: {
                        file: {
                            text: "File",
                            value: "file",
                            className: "blurred centered",
                        },
                        folder: {
                            text: "Folder",
                            value: "folder",
                            className: "blurred centered",
                        },
                    },
                })
                .then((value) => {
                    // console.log('TCL: displayNewItemPlaceholder -> value', value);
                    if (value) {
                        createMenuItem(value);
                    }
                });
        });
        system.appendChild(placeholder);
    }
}

// iterate through storage for access
// DO NOT DELETE ANY ITEMS IN STORAGE, THIS WILL MESS UP THE LOOP INDEX!!!
function iterateStorage(func) {
    for (let index = 0; index < localStorage.length; index++) {
        const itemName = localStorage.key(index);
        const item = getItemFromStorage(itemName);
        func(item, itemName, item.type, item.position, index);
    }
}

function toggleBtnHighlight(e) {
    if (e.target.classList.contains("btn")) {
        e.target.classList.toggle("btn-hover");
    }
}

document.addEventListener("mouseover", toggleBtnHighlight)

document.addEventListener("mouseout", toggleBtnHighlight)

function createMenuItem(type) {
    removeItemPlaceholder();
    type = type.toLowerCase();
    if (types.indexOf(type) < 0) {
        throw new TypeError(`menu item's type should be either folder or file, not ${type}`);
    }
    const itemNameInput = createItemNameInput(type);
    itemNameInput.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) { // ENTER key
            const shortItemName = itemNameInput.value;
            const fullItemName = getFullItemName(shortItemName);
            if (shortItemName.length >= minMenuItemLength) {
                if (itemNameList.indexOf(fullItemName) >= 0) { // repeated name
                    createErrorMessage(itemNameInput,
                        `Duplicated ${type} name, ${type} name must be unique`);
                } else {
                    itemNameList.push(fullItemName);
                    displayItem(fullItemName, type, itemNameInput);
                    storeNewItem(itemNameInput, type, position);
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

function getFullItemName(shortItemName) {
    return `${position}/${shortItemName}`;
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

function storeNewItem(itemNameInput, type, position) {
    console.log('TCL: storeNewItem -> storeNewItem');
    // store new item with the inputed name
    const itemInfo = {
        "position": position,
        "type": type
    };
    const itemName = `${position}/${itemNameInput.value}`;
    console.log('TCL: storeNewItem -> itemName', itemName);
    setItemInStorage(itemName, itemInfo);
    switch (type) {
        case "file":
            openFileEditField(itemName, itemInfo);
            break;
        case "equation":
            openEquationEditField(itemName, itemInfo);
            break;
    }
    return itemName;
}

// remove all labels of items and delete them in current item name list
// DOES NOT REMOVE FROM STORAGE!!!
function clearAllItems() {
    removeAllChildren(system); // delete all children in system div
    itemNameList.length = 0; // clear the current item list
}

function appendPosition(newPosition) {
    setPosition(`${position}/${newPosition}`);
}

// set the current position (folder)
function setPosition(newPosition) {
    position = newPosition;
    clearAllItems();
    updateAtPosition(newPosition);
    displayNavigationBar();
    displayItemPlaceholder();
}

// retrieve the item name from its full position path
// e.g. itemName = "home/folder1/file1"
// returns "file1"
function getEndOfPosition(itemName) {
    return itemName.substring(itemName.lastIndexOf("/") + 1);
}

// display item labels
function displayItem(itemName, itemType, itemPosition) {
    // replace input with label
    const itemLabel = document.createElement("p");
    const displayedName = getEndOfPosition(itemName);
    if (itemType === "file") {
        itemLabel.innerHTML = `📝`;
    } else if (itemType === "folder") {
        itemLabel.innerHTML = `📁`;
    } else {
        itemLabel.innerHTML = `<i class="far fa-calculator"></i>`;
    }
    itemLabel.innerHTML += displayedName;
    itemLabel.classList.add(itemType);
    itemLabel.classList.add("btn");
    itemLabel.classList.add("item");
    itemLabel.setAttribute("data-name", itemName);
    itemLabel.addEventListener("click", () => {
        const itemInfo = getItemFromStorage(itemName);
        const editField = document.getElementById("editField");
        if (editField) { // has previous item's editor open
            const previousItemName = editField.getAttribute("data-item");
            storeItem(previousItemName);
        }
        if (itemType === "file") {
            displayFile(itemLabel, itemName, itemInfo);
        } else if (itemType === "folder") {
            // set item location to the folder
            // console.log('TCL: displayItem -> position', position);
            if (getItemFromStorage(itemName)) {
                setPosition(itemName);
            } else {
                appendPosition(itemName);
            }
            // console.log('TCL: displayItem -> position', position);
        } else if (itemType === "equation") {
            displayEquation(itemLabel, itemName, itemInfo);
        }
    });
    // console.log("displaying item...");
    if (itemPosition) {
        // console.log('TCL: displayItem -> position', itemPosition);
        insertAfter(itemPosition, itemLabel);
    } else {
        system.appendChild(itemLabel);
    }
}

function storeItem(itemName) {
    console.log('TCL: storeItem -> itemName', itemName);
    const item = getItemFromStorage(itemName);
    console.log('TCL: storeItem -> item', item);
    if (item) { // item exists
        const itemType = item.type;
        console.log('TCL: storeItem -> itemType', itemType);
        switch (itemType) {
            case "file":
                storeFile(itemName, item);
                break;
            case "equation":
                storeEquation(itemName, item);
                break;
        }
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
    editor.setAttribute("data-type", "file");
    editor.rows = rowLength;
    // NOTE: cols are one character bigger than actual calculator's
    // line lengths because that's the space for vertical scroll bar
    editor.cols = lineLength + 1;
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
    // remove item in storage
    if (itemName) {
        removeItemFromStorage(itemName);
        removeElementInArray(itemNameList, itemName);
    }
    // remove item label
    itemLabel.remove();
    // remove associated edit field
    const editField = document.getElementById("editField");
    if (editField && editField.getAttribute("data-item") === itemName) {
        editField.remove();
    }
}

function renameItem(itemLabel) {
    const oldItemName = itemLabel.getAttribute("data-name");
    if (oldItemName) {
        const item = getItemFromStorage(oldItemName);
        const type = item.type;
        const itemNameInput = createItemNameInput();
        itemNameInput.value = getEndOfPosition(oldItemName);
        insertAfter(itemLabel, itemNameInput);
        itemNameInput.focus();
        // console.log('TCL: renameItem -> itemLabel', itemLabel);
        // console.log('TCL: renameItem -> itemLabel.parentNode', itemLabel.parentNode);
        itemLabel.remove();
        itemNameInput.addEventListener("keypress", (e) => {
            if (e.keyCode == 13) { // ENTER key
                const newItemName = getFullItemName(itemNameInput.value);
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

function pinToHome(itemLabel) {
    const itemName = itemLabel.getAttribute("data-name");
	console.log('TCL: pinToHome -> itemName', itemName);
    const shortItemName = getEndOfPosition(itemName);
	console.log('TCL: pinToHome -> shortItemName', shortItemName);
    const newItemName = `home/${shortItemName}`;
	console.log('TCL: pinToHome -> newItemName', newItemName);
    const item = getItemFromStorage(itemName);
    // set position to home
    item.position = homePosition;
    swal({
            title: "Give the pinned item a name",
            buttons: {
                sameName: {
                    text: "Same Name",
                    value: "sameName",
                },
                newName: {
                    text: "New Name",
                    value: "newName",
                },
                cancel: "Cancel",
            },
        })
        .then((value) => {
            switch (value) {
                case "sameName":
                    swal("Pinned to home!", {
                        icon: "success",
                        buttons: false,
                        timer: 800,
                    });
                    setItemInStorage(newItemName, item);
                    break;

                case "newName":
                    swal("enter a new name!");
                    break;
            }
        });
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

function convertWordsToSymbols(str) {
    for (const [key, value] of Object.entries(conversionTable)) {
        str = str.replace(new RegExp(RegExp.escape("\\" + key), "g"), value);
    }
    return str;
}

function convertSymbolsToWords(str) {
    for (const [key, value] of Object.entries(conversionTable)) {
        str = str.replace(new RegExp(RegExp.escape(value), "g"), "\\" + key);
    }
    return str;
}

function convertSingleQuotesToDoubleQuotes(str) {
    return str.replace(new RegExp(`'`, "g"), `"`);
}

function convertDoubleQuotesToSingleQuotes(str) {
    return str.replace(new RegExp(`"`, "g"), `'`);
}

function decodeFileContent(fileContent) {
    let content = convertSpacesToNewlines(fileContent);
    content = convertWordsToSymbols(content);
    content = convertSingleQuotesToDoubleQuotes(content);
    return content;
}

function encodeFileContent(fileContent) {
    let content = convertNewlinesToSpaces(fileContent);
    // double quotes cannot be in TI-BASIC's strings
    content = convertDoubleQuotesToSingleQuotes(content);
    return content;
}

function convertToUppercase(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (/^[a-zA-Z]*$/.test(char)) {
            result += char.toUpperCase();
        } else {
            result += char;
        }
    }
    return result;
}

function openFileEditField(itemName, itemInfo, position) {
    const editor = createFileEditor();
    editor.placeholder = "Write notes here"
    toUppercase = defaultToUppercase; // reset uppercase setting
    if (itemInfo.content !== undefined) {
        editor.value = decodeFileContent(itemInfo.content);
        editor.setAttribute("data-item", itemName);
        if (/[a-z]+/.test(editor.value)) { // contains lowercase
            // turn off to uppercase
            toUppercase = false;
        }
    }
    editor.addEventListener("input", () => {
        let content = editor.value;
        // content conversion
        content = convertWordsToSymbols(content);
        if (toUppercase && content.indexOf("\\") < 0) {
            content = convertToUppercase(content);
        }

        // update file size label
        updateItemSize(itemName, content);

        // console.log('TCL: openFileEditField -> content', content);
        // pasting in more than one line of content
        if (content.length - lastFileContent.length > lineLength) {
            let start = lastFileContent.lastIndexOf("\n");
            for (let end = 0; end < content.length; end++) {
                if (end - start === lineLength) {
                    content = insertSubstring(content, end + 1, "\n");
                    end++; // move to the newly inserted "\n"
                    start = end;
                }
            }
        } else if (content.length >= lastFileContent.length) { // typing individual characters
            const lastLineLength = content.length - content.lastIndexOf("\n") - 1;
            // console.log('TCL: openFileEditField -> lastLineLength', lastLineLength);
            if (lastLineLength > lineLength) {
                content = insertSubstring(content, content.length - 1, "\n", 0); // avoid word wrapping
            }
            // console.log('TCL: openFileEditField -> content.length', content.length);
        } else { // deleting contents
            // const cursorPosition = editor.selectionStart;
            // console.log('TCL: openFileEditField -> cursorPosition', cursorPosition);
            // let previousNewline = content.substring(0, cursorPosition)
            //     .lastIndexOf("\n");
            // console.log('TCL: openFileEditField -> previousNewline', previousNewline)
            // const nextNewline = content.indexOf("\n", cursorPosition);
            // if (previousNewline === -1){
            //     previousNewline = 0;
            // }
            // console.log('TCL: openFileEditField -> nextNewline', nextNewline);
            // if (nextNewline - previousNewline < lineLength){
            //     content = deleteSubstring(content, nextNewline, 1);
            //     content = insertSubstring(content, previousNewline + lineLength, "\n");
            // }
        }
        editor.value = content;
        lastFileContent = content;
    });

    const controlDiv = document.createElement("div");
    controlDiv.id = "editFieldControl";

    const submitBtn = document.createElement("span");
    submitBtn.id = "submitFileBtn";
    submitBtn.classList.add("btn");
    submitBtn.innerHTML = "Submit";
    submitBtn.addEventListener("click", () => {
        storeFile(itemName, itemInfo);
        editField.remove();
    });
    Mousetrap(editor).bind('mod+s', function (e, combo) {
        submitBtn.click();
        return false; // prevent event's default behavior
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
    editField.appendChild(controlDiv);
    controlDiv.appendChild(submitBtn);

    // add uppercase checkbox and info button
    controlDiv.insertAdjacentHTML("beforeend",
        `<div id="uppercaseDiv">
            <input type="checkbox" id="uppercaseCheckBox">
            <label for="uppercaseCheckBox">Uppercase</label>
            <i class="far fa-info-circle infoBtn" id="uppercaseInfoBtn"></i>
        </div>`);
    const uppercaseCheckBox = document.getElementById("uppercaseCheckBox");
    uppercaseCheckBox.checked = toUppercase;
    uppercaseCheckBox.addEventListener("change", () => {
        if (uppercaseCheckBox.checked !== toUppercase) {
            toUppercase = uppercaseCheckBox.checked;
            editor.value = convertToUppercase(editor.value);
        }
    });
    const uppercaseInfoBtn = document.getElementById("uppercaseInfoBtn");
    uppercaseInfoBtn.addEventListener("click", () => {
        swal({
            title: "Why does the text need to be in uppercase?",
            text: `1. Some lowercase words are predefined as keywords, like "and", "sin(", etc. in TI. Thus, their length cannot be accurately determined because keywords all occupy one space in TI. This can mess up note layout and hide some parts of the note. 
            2. Uppercase letters (1 byte each) take up less spaces than lowercase letters (2 bytes each).
            Sugguestion: You should stick with uppercase in all your notes.`,
            buttons: "okay",
        });
    });
    editor.focus();
}

function storeFile(itemName, itemInfo) {
    let content = document.getElementById("editor").value;
    console.log('TCL: storeFile -> content', content);
    content = encodeFileContent(content);
    itemInfo.content = content;
    setItemInStorage(itemName, itemInfo);
    // update file size
    updateItemSize(itemName, content);
}

function updateItemSize(itemName, content) {
    const fileLabel = document.querySelector(`p[data-name="${itemName}"]`);
    const size = countItemSize(itemName, content);
    // console.log('TCL: updateFileSize -> size', size);
    // remove previous label
    const sizeString = `${size} bits`;
    const sizeLabel = fileLabel.getElementsByClassName("sizeLabel");
    if (sizeLabel[0]) {
        sizeLabel[0].innerHTML = sizeString;
    } else {
        fileLabel.insertAdjacentHTML("beforeend",
            `<span style="float:right;" class="sizeLabel">${sizeString}</span>`);
    }
}

function countItemSize(itemName, content) {
    const item = getItemFromStorage(itemName);
    if (content === undefined) {
        content = item.content;
    }
    if (item.type === "file") {
        return countFileSize(content);
    } else {
        return countFolderSize(itemName);
    }
}

function countFolderSize(folderName) {
    let size = 0;
    iterateStorage(function (item, itemName, itemType, itemPosition, index) {
        if (itemPosition === folderName) {
            if (itemType === "file") {
                size += countFileSize(item.content);
            } else {
                size += countFolderSize(itemName);
            }
        }
    });
    return size;
}

function countFileSize(content) {
    let size = 0;
    if (content) { // content exists
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            // one-byte characters
            if (/[0-9A-Z{}()[\],.!?+\-*\/^:=<>≤≥≠π√ ]/.test(char)) {
                size += 1;
            } else { // all other symbols are two-bytes
                size += 2;
            }
        }
    }
    return size * 8; // convert bytes to bits
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
            str = deleteSubstring(str, index, 1);
            index--;
        } else {
            str = insertSubstring(str, index + 1, "\n", 0);
            index += lineLength + 1;
        }
    }
    return str;
}