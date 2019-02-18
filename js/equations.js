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

    // storing main equation
    eqInfo.equation = eqInput.value;

    // storing variable equations
    eqInfo.varEquations = getVarEquations();

    // storing variable descriptions
    eqInfo.varDescriptions = getVarDescriptions();

    // load all equation info into storage
    setItemInStorage(eqName, eqInfo);
}

function getVarDescriptions() {
    const varDescriptions = {};
    Array.from(document.getElementsByClassName("descriptionInput")).forEach((input) => {
        const variable = input.getAttribute("data-var");
        if (variable) {
            varDescriptions[variable] = input.value;
        }
    });
    return varDescriptions;
}

function getVarEquations() {
    const varEquations = {};
    Array.from(document.getElementsByClassName("eqInput")).forEach((input) => {
        const variable = input.getAttribute("data-var");
        if (variable) {
            varEquations[variable] = input.value;
        }
    });
    return varEquations;
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
    `);
    return editor;
}

function openEquationEditField(eqName, eqInfo, position) {
    const editor = createEquationEditor();
    editor.setAttribute("data-item", eqName);
    if (position === undefined) {
        system.appendChild(editor);
    } else {
        insertAfter(position, editor);
    }

    const eqInput = document.getElementById("eqInput");
    eqInput.classList.add("eqInput");
    eqInput.addEventListener("input", updateVarTable);

    // load equation info from storage
    if (eqInfo !== undefined) {
        if (eqInfo.equation) {
            eqInput.value = eqInfo.equation;
        }
        createVarTable(eqInfo);
    }

    function updateVarTable() {
        const eq = eqInput.value;
		console.log('TCL: updateVarTable -> eq', eq);
        const vars = getEquationVars(eq);
        console.log('TCL: updateVarTable -> vars', vars);
        let varTable = document.getElementById("varTable");
        console.log('TCL: updateVarTable -> varTable', varTable);
        if (varTable) {
            const rows = varTable.querySelectorAll(`tbody tr`);
            const rowVars = [];
            rows.forEach(
                (row) => {
                    rowVars.push(row.getAttribute("data-var"));
                }
            );
            console.log('TCL: updateVarTable -> rowVars', rowVars);
            vars.forEach(
                (variable) => {
                    if (rowVars.indexOf(variable) < 0) {
                        let newRow = `<tr data-var="${variable}"><th>${variable}</th><td>`;
                        // add variable equation column
                        newRow += `<input type="text" size="${eqLength}" class="eqInput" data-var="${variable}" spellcheck="false"></td>`;
                        // add variable description column
                        const varDescriptionLength = lineLength - variable.length - 1;
                        newRow += `<td><input type="text" class="descriptionInput" 
                size=${varDescriptionLength} maxlength=${varDescriptionLength} data-var="${variable}" spellcheck="false"`;
                        newRow += `</tr>`;
                        varTable.getElementsByTagName("tbody")[0].insertAdjacentHTML("beforeend", newRow);
                    }
                }
            )
            if (vars.length > 0) {
                rows.forEach(
                    (row) => {
                        const rowVar = row.getAttribute("data-var");
                        if (vars.indexOf(rowVar) < 0) {
                            row.remove();
                        }
                    }
                );
            }
            if (eq === "") {
                if (varTable) {
                    removeAllChildren(varTable);
                }
            }
        } else {
            createVarTable();
            updateVarTable();
        }
    }

    function getEquationVars(equation) {
        return nerdamer(equation.replace(/\=/g, " ")).variables();
    }

    function createVarTable(varInfo) {
        const eq = eqInput.value;
        const vars = getEquationVars(eq);
        console.log('TCL: createEquationEditor -> vars', vars);
        let varTable = document.getElementById("varTable");
        if (vars.length > 0) {
            let tableStr = `
        <div id="varArea">
        <label for="equationVars">Variables: </label>
        <span id="equationVars"></span>
        </div>
        <thead>
        <tr>
            <th>Vars</th>
            <th>Equations</th>
            <th>Description</th>
        </tr>
        </thead>`;
            vars.forEach((variable) => {
                const previousVarEquation = document.querySelector(`.eqInput[data-var="${variable}"`);

                // add variable name column
                tableStr += `<tr data-var="${variable}"><th>${variable}</th><td>`;
                // add variable equation column
                tableStr += `<input type="text" size="${eqLength}" class="eqInput" data-var="${variable}" spellcheck="false" `;
                if (previousVarEquation) {
                    tableStr += `value="${previousVarEquation.value}"`;
                }
                tableStr += `></input></td>`;

                // add variable description column
                const varDescriptionLength = lineLength - variable.length - 1;
                tableStr += `<td><input type="text" class="descriptionInput" 
                size=${varDescriptionLength} maxlength=${varDescriptionLength} data-var="${variable}" spellcheck="false"`;
                const previousVarDescription = document.querySelector(`.descriptionInput[data-var="${variable}"`);
                if (previousVarDescription) {
                    tableStr += `value="${previousVarDescription.value}"`;
                }
                tableStr += `></input></td>`;
                tableStr += `</tr>`;
            });
            if (!varTable) {
                varTable = document.createElement("table");
                varTable.id = "varTable";
            }
            varTable.innerHTML = tableStr;
            editor.appendChild(varTable);

            if (varInfo !== undefined) {
                const varEquations = varInfo.varEquations;
                const varDescriptions = varInfo.varDescriptions;
                // load var equations if specified
                if (varEquations) {
                    loadVarEquations(varEquations);
                }
                // load var descriptions if specified
                if (varDescriptions) {
                    loadVarDescriptions(varDescriptions);
                }
            }
        }
    }
}

function loadVarDescriptions(varDescriptions) {
    Array.from(document.getElementsByClassName("descriptionInput")).forEach((input) => {
        const variable = input.getAttribute("data-var");
        if (variable) {
            const varEquation = varDescriptions[variable];
            if (varEquation) { // not undefined or empty string
                input.value = varEquation;
            }
        }
    });
}

function loadVarEquations(varEquations) {
    Array.from(document.getElementsByClassName("eqInput")).forEach((input) => {
        const variable = input.getAttribute("data-var");
        if (variable) {
            const varEquation = varEquations[variable];
            if (varEquation) { // not undefined or empty string
                input.value = varEquation;
            }
        }
    });
}