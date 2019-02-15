// button for creating a new equation
const newEquationBtn = document.getElementById("newEquationBtn");
newEquationBtn.addEventListener("click", () => {
    createMenuItem("equation");
})
Mousetrap.bind("shift+e", (e) => { // keyboard shortcut
    newEquationBtn.click();
    return false;
});
function displayEquation(position, fileName, fileInfo){
    console.log("displaying equation...");
    // toggle file editor
    const equationField = document.getElementById("editField");
    if (equationField) {
        equationField.remove();
        const clickedItemName = equationField.getAttribute("data-item");
        if (clickedItemName !== fileName) { // not the same file
            displayEquation(position, fileName, fileInfo);
        }
    } else {
        openEquationEditField(fileName, fileInfo, position);
    }
}

function createEquationEditor(id) {
    const editor = document.createElement("div");
    if (id) {
        editor.id = id;
    } else {
        editor.id = "editField";
    }
    editor.classList.add("editor");
    editor.insertAdjacentHTML("afterbegin", 
    `
    <label>Equation: </label>
    <input type="text" size="15"></input><br/>
    <label>Variables: </label>
    <span id="equationVars"></span>
    `);
    return editor;
}

function openEquationEditField(eqName, eqInfo, position){
    const editor = createEquationEditor();
    editor.setAttribute("data-item", eqName);
    insertAfter(position, editor);
}