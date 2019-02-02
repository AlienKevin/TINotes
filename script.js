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

newFolderBtn.addEventListener("click", () => {createMenuItem("folder", location)});
newFileBtn.addEventListener("click", () => {createMenuItem("file", location)});

function createMenuItem(type, location){
    type = type.toLowerCase();
	console.log('TCL: createNewMenuItem -> type', type);
    if (type !== "folder" && type !== "file"){
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
            // store new folder with the inputed name
            const itemInfo = {
                "location": location,
                "type": type
            };
            const itemName = newItem.value;
            localStorage.setItem(itemName, JSON.stringify(itemInfo));
            // remove item name input
            newItem.remove();
            // replace input with label
            newItem = document.createElement("p");
            newItem.innerHTML = itemName;
            newItem.classList.add(type);
            newItem.classList.add("btn");
            system.appendChild(newItem);
        }
      });
    system.appendChild(newItem);
}