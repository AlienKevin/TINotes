// button for creating a new equation
const newEquationBtn = document.getElementById("newEquationBtn");
const eqLength = 20;
let guppyInput;
let warningTimerId; // timer id for settimeout of warning sign
// Add guppyOSK mobile keyboard
guppyOSK = new GuppyOSK();
Guppy.use_osk(new GuppyOSK({
    "goto_tab": "arithmetic",
    "attach": "focus"
}));
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

    // storing equation in asciimath
    eqInfo.equation = getEquation();

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

const equationTextToSymbol = {
    "absolutevalue(": "abs(",
    "squareroot(": "sqrt(",
}

function convertTextToSymbol(textEquation) {
    Object.entries(equationTextToSymbol).forEach(([text, symbol]) => {
        textEquation = textEquation.replace(new RegExp(RegExp.escape(text), "g"), symbol);
    });
    console.log('TCL: convertTextToSymbol -> textEquation', textEquation);
    return textEquation;
}

function convertSymbolToText(symbolEquation) {
    Object.entries(equationTextToSymbol).forEach(([text, symbol]) => {
        symbolEquation = symbolEquation.replace(new RegExp(RegExp.escape(symbol), "g"), text);
    });
    return symbolEquation;
}

function getEquation() {
    try {
        const equation = convertTextToSymbol(guppyInput.engine.get_content("text"));
        detachWarning(eqInput);
        return equation;
    } catch (e) {
        warningTimerId = setTimeout(() => {
            AttachWarning(eqInput)
        }, 500);
        console.log('TCL: timerId -> timerId', warningTimerId);
    }
    return ""; // no equation found
}

function AttachWarning(element) {
    console.log('TCL: AttachWarning -> AttachWarning');
    const warningSign = element.parentNode.querySelector(`.warning`);
    if (!warningSign) {
        element.insertAdjacentHTML("afterend", `<i class="fa fa-exclamation-triangle warning" aria-hidden="true"></i>`);
    }
}

function detachWarning(element) {
    console.log('TCL: detachWarning -> detachWarning');
    console.log('TCL: detachWarning -> timerId', warningTimerId);
    const warningSign = element.parentNode.querySelector(`.warning`);
    // clearTimeout(timerId);
    if (warningSign) {
        console.log('TCL: detachWarning -> removing warningSign', warningSign);
        warningSign.remove();
    } else {
        clearTimeout(warningTimerId);
    }
}

function setEquation(equation) {
    if (equation) {
        console.log('TCL: setEquation -> equation', equation);
        guppyInput.import_text(convertSymbolToText(equation));
        guppyInput.engine.end();
        guppyInput.activate();
        guppyInput.render(true);
        removeExtraGuppyOSKTabs();
    }
}

function createEquationEditor() {
    const editor = document.createElement("div");
    editor.id = "editField";
    editor.classList.add("editor");
    editor.setAttribute("data-type", "equation");
    editor.insertAdjacentHTML("afterbegin",
        `<div>
    <label for="eqInput">Equation: </label>
    <div id="eqInput" type="text" size="${eqLength}" spellcheck="false"></div>
    </div>
    `);
    return editor;
}

function removeExtraGuppyOSKTabs() {
    console.log('TCL: removeExtraGuppyOSKTabs -> removeExtraGuppyOSKTabs');
    // remove extra tabs
    document.querySelector('#guppy_osk_tab_calculus').remove();
    document.querySelector('#guppy_osk_tab_array').remove();
    document.querySelector('#guppy_osk_tab_editor').remove();
    document.querySelector('#guppy_osk_tab_emoji').remove();
    document.querySelector('#guppy_osk_tab_operations').remove();

    // remove extra control buttons
    document.querySelector('body > div.guppy_osk > div.tabbar > div.scroller-left').remove();
    document.querySelector('body > div.guppy_osk > div.tabbar > div.scroller-right').remove();

    setTimeout(function () { // use settimeout to avoid obstructing the program flow

        // remove extra functions in tabs
        document.querySelector('#functions > span:nth-child(1)').remove();
        document.querySelector('#functions > span:nth-child(2)').remove();
        document.querySelector('#functions > span:nth-child(4)').remove();
        for (let i = 0; i < 4; i++) {
            document.querySelector('#functions > span:nth-child(8)').remove();
        }

        // remove extra greek letters
        console.log("removing extra greek letters...");
        document.querySelectorAll('#greek span > span.katex-mathml > math > semantics > mrow > mi').forEach(cell => {
            console.log('TCL: removeExtraGuppyOSKTabs -> cell', cell);
            const letter = cell.innerHTML;
            if (Object.values(conversionTable).indexOf(letter) < 0) {
                cell.closest("span.guppy_osk_key").remove();
            }
        })

        // remove extra trig functions
        document.querySelectorAll('#trigonometry span > span > span.katex-mathml > math > semantics > mrow > mi').forEach(cell => {
            const funcName = cell.innerHTML;
            const allowedTrigFunctions = ["cos", "sin", "tan", "arccos", "arcsin", "arctan", "log", "ln"];
            if (allowedTrigFunctions.indexOf(funcName) < 0) {
                cell.closest("span.guppy_osk_key").remove();
            }
        })
    }, 100);
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
    // convert div to guppy editor
    guppyInput = new Guppy("eqInput");
    guppyInput.configure("blacklist", ["norm", "utf8", "eval", "integral", "defintegral", "derivative", "summation", "product", "root", "vector", "point", "matrix", "infinity", "banana", "pineapple", "kiwi", "mango"]);
    guppyInput.configure("cliptype", "text");
    guppyInput.configure("button", ["osk", "settings", "symbols", "controls"]);
    guppyInput.event("change", updateVarTable);
    const previousEquation = eqInfo.equation;
    if (previousEquation) {
        console.log('TCL: previousEquation', previousEquation);
        setEquation(previousEquation);
    }
    guppyInput.event("focus", (focusedObj) => {
        if (focusedObj.focused) {
            console.log('TCL: focused', focusedObj);
            removeExtraGuppyOSKTabs();
            editor.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            });
        }
    })

    // Scroll editor into view
    editor.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
    });

    // load equation info from storage
    if (eqInfo !== undefined) {
        if (eqInfo.equation) {
            guppyInput.value = eqInfo.equation;
        }
        createVarTable(eqInfo);
    }

    function updateVarTable() {
        const eq = getEquation();
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
                        const newRow = createNewRowHTML(variable);
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
                    varTable.remove();
                }
            }
        } else {
            createVarTable();
        }
    }

    function getEquationVars(equation) {
        let variables = [];
        try {
            variables = nerdamer(equation.replace(/\=/g, " ")).variables();
            deleteStrInArray("ln", variables);
        } catch (e) {}
        return variables;
    }

    function createVarTable(varInfo) {
        const eq = getEquation();
        detachWarning(eqInput);
        const vars = getEquationVars(eq);
        console.log('TCL: createEquationEditor -> vars', vars);
        let varTable = document.getElementById("varTable");
        if (vars.length > 0) {
            let tableStr = `
            <thead>
            <tr>
                <th>Vars</th>
                <th>Equations</th>
                <th>Description</th>
            </tr>
            </thead>`;
            vars.forEach((variable) => {
                tableStr += createNewRowHTML(variable);
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

function createNewRowHTML(variable) {
    let newRow = `<tr data-var="${variable}"><th>${variable}</th><td>`;
    // add variable equation column
    newRow += `<input type="text" size="${eqLength}" class="eqInput" data-var="${variable}" spellcheck="false"></td>`;
    // add variable description column
    const varDescriptionLength = lineLength - variable.length - 1;
    newRow += `<td><input type="text" class="descriptionInput" 
size=${varDescriptionLength} maxlength=${varDescriptionLength} data-var="${variable}" spellcheck="false"`;
    newRow += `</tr>`;
    return newRow;
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