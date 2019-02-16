// button for creating a new equation
const newEquationBtn = document.getElementById("newEquationBtn");
const eqLength = 20;
newEquationBtn.addEventListener("click", () => {
    createMenuItem("equation");
})
Mousetrap.bind("shift+e", (e) => { // keyboard shortcut
    newEquationBtn.click();
    return false;
});

function displayEquation(position, eqName, eqInfo) {
    console.log("displaying equation...");
    // toggle file editor
    const equationField = document.getElementById("editField");
    if (equationField) {
        equationField.remove();
        const clickedItemName = equationField.getAttribute("data-item");
        if (clickedItemName !== eqName) { // not the same item
            displayEquation(position, eqName, eqInfo);
        }
    } else {
        openEquationEditField(eqName, eqInfo, position);
    }
}

function storeEquation(eqName, eqInfo) {
    const eqInput = document.getElementById("eqInput");
    eqInfo.equation = eqInput.value;
    const vars = {};
    Array.from(document.getElementsByClassName("eqInput")).forEach(
        (input) => {
            const variable = input.getAttribute("data-var");
            if (variable) {
                vars[variable] = input.value;
            }
        }
    )
    eqInfo.vars = vars;
    setItemInStorage(eqName, eqInfo);
}

function createEquationEditor() {
    const editor = document.createElement("div");
    editor.id = "editField";
    editor.classList.add("editor");
    editor.setAttribute("data-type", "equation");
    editor.insertAdjacentHTML("afterbegin",
        `<div>
    <label for="eqInput">Equation: </label>
    <input id="eqInput" type="text" size="${eqLength}" spellcheck="false"></input>
    </div>
    <div id="varArea">
    <label for="equationVars">Variables: </label>
    <span id="equationVars"></span>
    </div>
    `);
    return editor;
}

function openEquationEditField(eqName, eqInfo, position) {
    const editor = createEquationEditor();
    editor.setAttribute("data-item", eqName);
    insertAfter(position, editor);

    const eqInput = document.getElementById("eqInput");
    eqInput.classList.add("eqInput");
    eqInput.addEventListener("input", updateVarTable);

    // load equation info from storage
    if (eqInfo !== undefined) {
        if (eqInfo.equation) {
            eqInput.value = eqInfo.equation;
        }
        if (eqInfo.vars) {
            updateVarTable(eqInfo.vars)
        } else {
            updateVarTable();
        }
    }

    function updateVarTable(varsInfo) {
        const eq = eqInput.value;
        const vars = nerdamer(eq.replace(/\=/g, " ")).variables();
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
            <td><input type="text" size="${eqLength}" class="eqInput" data-var="${variable}" spellcheck="false"></input></td>
            </tr>`;
        });
        if (!varTable) {
            varTable = document.createElement("table");
            varTable.id = "varTable";
        }
        varTable.innerHTML = tableStr;
        editor.appendChild(varTable);

        if (varsInfo !== undefined) {
            // load var equations if specified
            Array.from(document.getElementsByClassName("eqInput")).forEach(
                (input) => {
                    const variable = input.getAttribute("data-var");
                    if (variable) {
                        const varEquation = varsInfo[variable];
                        if (varEquation) { // not undefined or empty string
                            input.value = varEquation;
                        }
                    }
                }
            )
        }
    }
}