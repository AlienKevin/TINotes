// button for creating a new equation
const newEquationBtn = document.getElementById("newEquationBtn");
const eqLength = 20;
const varDescriptionLength = 20;
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
        updateVarTable(eqInfo);
    }

    function updateVarTable(varInfo) {
        const eq = eqInput.value;
        const vars = nerdamer(eq.replace(/\=/g, " ")).variables();
        console.log('TCL: createEquationEditor -> vars', vars);
        let varTable = document.getElementById("varTable");
        if (vars.length > 0) {
            let tableStr = `
        <div id="varArea">
        <label for="equationVars">Variables: </label>
        <span id="equationVars"></span>
        </div>
        <tr>
            <th>Vars</th>
            <th>Equations</th>
            <th>Description</th>
        </tr>`;
            vars.forEach((variable) => {
                const previousVarEquation = document.querySelector(`.eqInput[data-var="${variable}"`);

                // add variable name column
                tableStr += `<tr><th>${variable}</th><td>`;
                // add variable equation column
                tableStr += `<input type="text" size="${eqLength}" class="eqInput" data-var="${variable}" spellcheck="false" `;
                if (previousVarEquation) {
                    tableStr += `value="${previousVarEquation.value}"`;
                }
                tableStr += `></input></td>`;

                // add variable description column
                tableStr += `<td><input type="text" class="descriptionInput" 
                size=${varDescriptionLength} data-var="${variable}" spellcheck="false"`;
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
        } else if (eq === "") {
            if (varTable) {
                removeAllChildren(varTable);
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
