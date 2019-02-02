// set up calculator type
let calculatorType = "color";
document.querySelector(`input#${calculatorType}`).setAttribute("checked", true);
document.querySelectorAll('input[name="calculatorType"]')
.forEach((el) => {
    el.addEventListener("change", (e) => {
    calculatorType = e.target.value;
	// console.log('TCL: e.target', e.target);
})});
let lineLength, rowLength;
// set up variables for different calculators
switch (calculatorType){
    case "monochrome": // e.g. TI-83
        lineLength = 16;
        rowLength = 8;
    break;
    case "color": // e.g. TI-84/CSE/CE
        lineLength = 26;
        rowLength = 10;
    break;
}
const menuTitleLength = lineLength;
const menuItemLength = lineLength - 2;

const newFolderBtn = document.getElementById("newFolderBtn");
const system = document.getElementById("system");
newFolderBtn.addEventListener("click",(e) => {
    let newFolder = document.createElement("input");
    newFolder.setAttribute("type", "text");
    newFolder.placeholder = "Enter folder name here";
    newFolder.minLength = 1;
    newFolder.maxLength = menuItemLength;
    newFolder.classList.add("fileNameInput");
    system.appendChild(newFolder);
});