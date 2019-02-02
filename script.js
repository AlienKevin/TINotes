// set up variables for different calculators
switch (calculatorType){
    case "monochrome": // e.g. TI-83
        const lineLength = 16;
        const rowLength = 8;
    break;
    case "color": // e.g. TI-84/CSE/CE
        const lineLength = 26;
        const rowLength = 10;
    break;
}
const menuTitleLength = lineLength;
const menuItemLength = lineLength - 2;

let newFolderBtn = document.getElementById("newFolderBtn");
let system = document.getElementById("system");
newFolderBtn.addEventListener("click",(e) => {
    let newFolder = document.createElement("input");
    newFolder.setAttribute("type", "text");
    newFolder.placeholder = "Enter folder name here";
    newFolder.classList.add("fileNameInput");
    system.appendChild(newFolder);
});