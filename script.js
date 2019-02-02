// set up namespace for this app
const app = {};
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
const system = document.getElementById("system");
app.location = "home"; // default root location for the file system
newFolderBtn.addEventListener("click", (e) => {
    let newFolder = document.createElement("input");
    newFolder.setAttribute("type", "text");
    newFolder.placeholder = "Enter folder name here";
    newFolder.minLength = 1;
    newFolder.maxLength = menuItemLength;
    newFolder.classList.add("fileNameInput");
    newFolder.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) { // ENTER key
            // store new folder with the inputed name
            const folderInfo = {
                "location": app.location,
                "type": "folder"
            };
            const folderName = newFolder.value;
            localStorage.setItem(folderName, JSON.stringify(folderInfo));
            // remove folder name input
            newFolder.remove();
            // replace it with label
            newFolder = document.createElement("p");
            newFolder.innerHTML = folderName;
            newFolder.classList.add("folder");
            newFolder.classList.add("btn");
            system.appendChild(newFolder);
        }
      });
    system.appendChild(newFolder);
});