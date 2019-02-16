// button for creating a new equation
const newEquationBtn = document.getElementById("newEquationBtn");
const eqLength = 15;
newEquationBtn.addEventListener("click", () => {
    createMenuItem("equation");
})
Mousetrap.bind("shift+e", (e) => { // keyboard shortcut
    newEquationBtn.click();
    return false;
});
function displayEquation(position, eqName, eqInfo){
    console.log("displaying equation...");
    // toggle file editor
    const equationField = document.getElementById("editField");
    if (equationField) {
        const eqInput = document.getElementById("eqInput");
        eqInfo.equation = eqInput.value;
        setItemInStorage(eqName, eqInfo);
        equationField.remove();
        const clickedItemName = equationField.getAttribute("data-item");
        if (clickedItemName !== eqName) { // not the same file
            displayEquation(position, eqName, eqInfo);
        }
    } else {
        openEquationEditField(eqName, eqInfo, position);
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
    <label for="eqInput">Equation: </label>
    <input id="eqInput" type="text" size="${eqLength}"></input><br/>
    <label for="equationVars">Variables: </label>
    <span id="equationVars"></span>
    `);
    return editor;
}

function openEquationEditField(eqName, eqInfo, position){
    const editor = createEquationEditor();
    editor.setAttribute("data-item", eqName);
    insertAfter(position, editor);

    const eqInput = document.getElementById("eqInput");
    eqInput.addEventListener("input", () => {
        const eq = eqInput.value;
        const vars = nerdamer(eq).variables();
        console.log('TCL: createEquationEditor -> vars', vars);
        let varTable = document.getElementById("varTable");
        let tableStr = `
        <tr>
            <th>Vars</th>
            <th>Equations</th>
        </tr>`;
        vars.forEach((variable) => {
            tableStr += `<tr>
            <th>${variable}</th>
            <td><input type="text" size="${eqLength}"></input></td>
            </tr>`;
        });
        if (!varTable){
            varTable = document.createElement("table");
            varTable.id = "varTable";
        }
        varTable.innerHTML = tableStr;
        editor.appendChild(varTable);
    });

    if (eqInfo !== undefined) {
        if (eqInfo.equation){
            eqInput.value = eqInfo.equation;
        }
    }
}