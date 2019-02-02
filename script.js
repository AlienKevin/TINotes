// set up calculator type
let calculatorType = "color";
document.querySelector(`input#${calculatorType}`).setAttribute("checked", true);
document.querySelectorAll('input[name="calculatorType"]')
    .forEach((el) => {
        el.addEventListener("change", (e) => {
            calculatorType = e.target.value;
            changeCalculatorType();
			// console.log('TCL: e.target', e.target);
        })
    });
let lineLength, rowLength, menuTitleLength, menuItemLength;
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

const newFolderBtn = document.getElementById("newFolderBtn");
const newFileBtn = document.getElementById("newFileBtn");
const system = document.getElementById("system");
let position = "home"; // default root location for the file system

newFolderBtn.addEventListener("click", () => {
    createMenuItem("folder", position)
});
newFileBtn.addEventListener("click", () => {
    createMenuItem("file", position)
});

function createMenuItem(type, position) {
    type = type.toLowerCase();
	// console.log('TCL: createNewMenuItem -> type', type);
    if (type !== "folder" && type !== "file") {
        throw new TypeError(`menu item's type should be either folder or file, not ${type}`);
    }
    let newItem = document.createElement("input");
    newItem.setAttribute("type", "text");
    newItem.placeholder = `Enter ${type} name here`;
    newItem.minLength = 1;
    newItem.maxLength = menuItemLength;
    newItem.classList.add("itemNameInput");
    newItem.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) { // ENTER key
            const itemName = storeItem(newItem, type, position);
            displayItem(itemName, type);
        }
    });
    system.appendChild(newItem);
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
    } else{
        localStorage.setItem(itemName, JSON.stringify(itemInfo));
    }
    // remove item name input
    newItem.remove();
    return itemName;
}

function displayItem(itemName, type) {
    // replace input with label
    const newItem = document.createElement("p");
    newItem.innerHTML = itemName;
    newItem.classList.add(type);
    newItem.classList.add("btn");
    system.appendChild(newItem);
}

function openFileEditor(itemName, itemInfo) {
    const editor = document.createElement("textarea");
    editor.id = "editor";
    editor.rows = rowLength;
    editor.cols = lineLength;
    editor.placeholder = "Write notes here"
    editor.addEventListener("keypress", (e) => {
        if (e.keyCode == 13) { // ENTER key
            e.defaultPrevented = true; // no linebreak allowed in file
        }
    });
    system.appendChild(editor);
    const submitBtn = document.createElement("span");
    submitBtn.classList.add("btn");
    submitBtn.innerHTML = "Submit";
    submitBtn.addEventListener("click", () => {
        // return file content
        itemInfo.content = editor.value;
        localStorage.setItem(itemName, JSON.stringify(itemInfo));
        editor.remove();
        submitBtn.remove();
    });
    system.appendChild(submitBtn);
}