// button for creating a new equation
const newEquationBtn = document.getElementById("newEquationBtn");
const eqLength = 20;
let mainInput;
let varInputs = {};
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
    // storing equation in plain text
    eqInfo.equation = getMainEquation(false);

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
    Object.keys(varInputs).forEach((variable) => {
        // only store equtions that are open in editField
        if (document.querySelector(`.eqInput[data-var="${variable}"]`)) {
            varEquations[variable] = getEquation(varInputs[variable], variable, true);
        }
    });
    return varEquations;
}

const equationTextToSymbol = {
    "absolutevalue(": "abs(",
    "squareroot(": "sqrt(",
    "neg(": "-(",
}

function convertTextToSymbol(textEquation) {
    Object.entries(equationTextToSymbol).forEach(([text, symbol]) => {
        textEquation = textEquation.replace(new RegExp(RegExp.escape(text), "g"), symbol);
    });
    // console.log('TCL: convertTextToSymbol -> textEquation', textEquation);
    return textEquation;
}

function convertSymbolToText(symbolEquation) {
    Object.entries(equationTextToSymbol).forEach(([text, symbol]) => {
        symbolEquation = symbolEquation.replace(new RegExp(RegExp.escape(symbol), "g"), text);
    });
    return symbolEquation;
}

function getMainEquation(inGuppyPlainTextFormat) {
    try {
        let equation = getEquation(mainInput, "main", inGuppyPlainTextFormat);
        console.log('TCL: getEquation -> equation', equation);
        detachWarning(eqInput);
        return equation;
    } catch (e) {
        warningTimerId = setTimeout(() => {
            AttachWarning(eqInput)
        }, 500);
        // console.log('TCL: timerId -> timerId', warningTimerId);
    }
    return new Error("error loading equation");
}

function getEquation(input, varName, inGuppyPlainTextFormat) {
    let inputContent = "";
    try {
        inputContent = input.engine.get_content("text");
    } catch (e) {
        AttachWarning(document.querySelector(`.eqInput[data-var="${varName}"]`));
        throw new Error("Some equations are invalid!");
    }
    let equation = convertTextToSymbol(inputContent);
    equation = handleSubscripts(equation, inGuppyPlainTextFormat);
    return equation;
}

function handleVarNameSubscripts(varName) {
    if (varName.indexOf("_") >= 0) {
        return handleSubscripts(`(${varName})`, true);
    } else {
        return varName;
    }
}

function AddParenthesesAroundVarName(equation) {
    let vars = nerdamer(equation).variables();
    const searchVarNames = {};
    // filter out vars without subscripts
    vars = vars.filter(varName => varName.indexOf("_") >= 0);
    vars.forEach(varName => {
        const varMap = {};
        const searchVarName = "_" + varName.replace("_", "c") + "_";
        varMap[varName] = searchVarName;
        searchVarNames[varName] = searchVarName;
        equation = nerdamer(equation, varMap).text();
        console.log('TCL: AddParenthesesAroundVarName -> equation', equation);
    });
    vars.forEach(varName => {
        const varNameWithParen = "(" + varName + ")";
        equation = equation.replace(new RegExp(searchVarNames[varName], "g"), varNameWithParen);
    });
    return equation;
}

function handleSubscripts(equation, inGuppyPlainTextFormat = true, AddParentheses = false) {
    if (equation.indexOf("_") >= 0) { // contains subscripts
        if (AddParentheses) {
            equation = AddParenthesesAroundVarName(equation);
        }
        let startIndex = 0;
        let underscoreIndex = equation.indexOf("_", startIndex);
        while (underscoreIndex >= 0) {
            // console.log("underscoreIndex: ", underscoreIndex);
            const openParenIndex = equation.lastIndexOf("(", underscoreIndex);
            // console.log("openParenIndex: ", openParenIndex);
            let closeParenIndex = findClosingBracketMatchIndex(equation, openParenIndex);
            // console.log("closeParenIndex: ", closeParenIndex);
            let subscriptStartIndex, subscriptEndIndex;
            if (inGuppyPlainTextFormat) {
                if (underscoreIndex + 1 < equation.length && equation.charAt(underscoreIndex + 1) !== "(") { // no open paren after underscore
                    // surround the single subscript with a pair of parentheses
                    equation = insertSubstring(equation, underscoreIndex + 1, "(");
                    equation = insertSubstring(equation, closeParenIndex + 1, ")");
                    closeParenIndex += 2; // two parentheses added
                    // console.log("equation: " + equation);
                }
                subscriptStartIndex = underscoreIndex + 2;
                subscriptEndIndex = closeParenIndex - 1;
            } else {
                if (underscoreIndex + 1 < equation.length && equation.charAt(underscoreIndex + 1) === "(") { // open paren after underscore
                    equation = deleteSubstring(equation, underscoreIndex + 1, 1);
                    equation = deleteSubstring(equation, closeParenIndex - 1, 1);
                    closeParenIndex -= 2; // two parentheses deleted
                }
                //   console.log("equation: " + equation);
                subscriptStartIndex = underscoreIndex + 1;
                subscriptEndIndex = closeParenIndex + 1;
                //   console.log("subscriptStartIndex: " + subscriptStartIndex);
                //   console.log("subscriptEndIndex: " + subscriptEndIndex);
            }
            let subscript = "";
            for (let i = subscriptStartIndex; i < subscriptEndIndex; i++) {

                const char = equation.substring(i, i + 1);
                // console.log("char: ", char);
                if (char !== "(" && char !== ")" && char != "*" && char != " ") {
                    subscript += char;
                    if (inGuppyPlainTextFormat && i < subscriptEndIndex - 1) {
                        subscript += "*";
                    }
                }
            }
            // console.log("subscript: " + subscript);
            equation = insertSubstring(equation, subscriptStartIndex, subscript, subscriptEndIndex - underscoreIndex - 2);
            startIndex = underscoreIndex + 1;
            underscoreIndex = equation.indexOf("_", startIndex);
        }
        return equation;
    } else {
        return equation;
    }
}

function AttachWarning(element) {
    // console.log('TCL: AttachWarning -> AttachWarning');
    const warningSign = element.parentNode.querySelector(`.warning`);
    if (!warningSign) {
        element.insertAdjacentHTML("afterend", `<i class="fa fa-exclamation-triangle warning" aria-hidden="true"></i>`);
    }
}

function detachWarning(element) {
    // console.log('TCL: detachWarning -> detachWarning');
    // console.log('TCL: detachWarning -> timerId', warningTimerId);
    const warningSign = element.parentNode.querySelector(`.warning`);
    // clearTimeout(timerId);
    if (warningSign) {
        // console.log('TCL: detachWarning -> removing warningSign', warningSign);
        warningSign.remove();
    } else {
        clearTimeout(warningTimerId);
    }
}

function setMainEquation(equation) {
    if (equation) {
        console.log('TCL: setEquation -> convertSymbolToText(equation)', convertSymbolToText(equation));
        setInputEquation(mainInput, equation);
        mainInput.engine.end();
        mainInput.activate();
        mainInput.render(true);
    }
}

function setInputEquation(input, equation, AddParentheses = false) {
    console.log('TCL: setInputEquation -> equation', equation);
    const processedEquation = convertSymbolToText(handleSubscripts(equation, true, AddParentheses));
    console.log('TCL: setInputEquation -> processedEquation', processedEquation);
    if (processedEquation) {
        input.import_text(processedEquation);
    } else {
        input.engine.sel_all();
        input.engine.sel_clear();
    }
    input.engine.end();
    input.render(true);
}

function configureInput(input) {
    input.configure("blacklist", [
        // some disallowed functions
        "norm", "utf8", "eval", "integral", "defintegral", "derivative", "summation", "product", "root", "vector", "point", "matrix",
        // infinity is not allowed
        "infinity",
        // no emojis
        "banana", "pineapple", "kiwi", "mango",
        // no hyperbolic trigs
        "sinh", "cosh", "tanh",
        // some disallowed greek letters
        "zeta", "eta", "iota", "kappa", "nu", "xi", "upsilon", "chi", "psi", "omega", "Theta", "Lambda", "Xi", "Pi", "Psi",
    ]);
    input.configure("cliptype", "text");
    input.configure("button", ["osk", "settings", "symbols", "controls"]);
    input.event("focus", (focusedObj) => {
        if (focusedObj.focused) {
            // console.log('TCL: focused', focusedObj);
            removeExtraGuppyOSKTabs();
            document.getElementById("editField").scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            });
        }
    });
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
    // console.log('TCL: removeExtraGuppyOSKTabs -> removeExtraGuppyOSKTabs');
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
            // console.log('TCL: removeExtraGuppyOSKTabs -> cell', cell);
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
    eqInput.setAttribute("data-var", "main");
    // convert div to guppy editor
    mainInput = new Guppy("eqInput");
    configureInput(mainInput)
    mainInput.event("change", updateVarTable);
    // const previousEquation = eqInfo.equation;
    // if (previousEquation) {
    //     console.log('TCL: previousEquation', previousEquation);
    //     setEquation(previousEquation);
    // }

    // load equation info from storage
    if (eqInfo !== undefined) {
        if (eqInfo.equation) {
            setMainEquation(eqInfo.equation);
        }
        console.log("Creating Var Table ...");
        createVarTable(eqInfo);
    }

    function updateVarTable() {
        const eq = getMainEquation();
        console.log('TCL: updateVarTable -> eq', eq);
        const vars = getEquationVars(eq);
        console.log('TCL: updateVarTable -> vars', vars);
        let varTable = document.getElementById("varTable");
        // console.log('TCL: updateVarTable -> varTable', varTable);
        if (varTable) {
            const rows = varTable.querySelectorAll(`tbody tr`);
            const rowVars = [];
            rows.forEach(
                (row) => {
                    rowVars.push(row.getAttribute("data-var"));
                }
            );
            // console.log('TCL: updateVarTable -> rowVars', rowVars);
            vars.forEach(
                (variable) => {
                    const tbody = varTable.getElementsByTagName("tbody")[0];
                    if (rowVars.indexOf(variable) < 0) {
                        const newRow = createNewRowHTML(variable);
                        tbody.insertAdjacentHTML("beforeend", newRow);
                        varInputs[variable] = new Guppy(`eqInput-${variable}`);
                        configureInput(varInputs[variable]);
                    }
                    console.log("Solving var equations...");
                    setInputEquation(varInputs[variable], solveEquation(eq, variable), true);
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
            if (!eq instanceof Error && eq === "") {
                if (varTable) {
                    varTable.remove();
                }
            }
        } else {
            createVarTable();
        }
        renderEquationVars();
    }

    function getEquationVars(equation) {
        let variables = [];
        try {
            variables = nerdamer(handleSubscripts(equation.replace(/\=/g, " "), false)).variables();
            console.log('TCL: getEquationVars -> variables', variables);
            console.log("Handling subscripts in equation vars...");
            deleteStrInArray("ln", variables);
        } catch (e) {}
        return variables;
    }

    function createVarTable(varInfo) {
        console.log('TCL: createVarTable -> varInfo', varInfo);
        const eq = getMainEquation();
        detachWarning(eqInput);
        const vars = getEquationVars(eq);
        // console.log('TCL: createEquationEditor -> vars', vars);
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

            vars.forEach((variable) => {
                varInputs[variable] = new Guppy(`eqInput-${variable}`);
                configureInput(varInputs[variable]);
            })

            if (varInfo !== undefined) {
                const varEquations = varInfo.varEquations;
                console.log('TCL: createVarTable -> varEquations', varEquations);
                const varDescriptions = varInfo.varDescriptions;
                console.log('TCL: createVarTable -> varDescriptions', varDescriptions);
                // load var equations if specified
                if (varEquations) {
                    loadVarEquations(varEquations);
                    renderEquationVars();
                }
                // load var descriptions if specified
                if (varDescriptions) {
                    loadVarDescriptions(varDescriptions);
                }
            }
        }
    }
}

function solveEquation(equation, variable) {
    console.log('TCL: solveEquation -> equation', handleSubscripts(equation, false));
    const solution = nerdamer.solve(handleSubscripts(equation, false), variable);
    let finalResult = ""; // default to no real solutions
    if (solution.symbol && solution.symbol.elements) {
        // return solution.symbol.elements[0].text();
        solution.symbol.elements.some(element => {
            console.log('TCL: solveEquation -> element', element.text());
            if ((element.symbol ? (element.symbol.isImaginary() === false) : (true)) // not imaginary number
                &&
                (element.value === "#" ? (element.gte(0)) : (nerdamer(element.text()).evaluate().text().startsWith("-") === false))) { // number must be greater than 0; expr must not start with negative sign
                console.log("Result is greater than 0!");
                finalResult = Algebrite.simplify(element.text()).toString();
                return true; // exit the loop
            }
            return false; // keep looping
        });
    }
    console.log('TCL: solveEquation -> finalResult', finalResult);
    return finalResult;
}

function renderEquationVars() {
    console.log('TCL: renderEquationVars -> renderEquationVars');
    const result = Guppy.Doc.render_all("text", "$$");
    console.log('TCL: renderEquationVars -> result', result);
    const varTable = document.getElementById("varTable");
    if (varTable) {
        varTable.querySelectorAll("tbody tr").forEach(
            (row) => {
                console.log('TCL: renderEquationVars -> row', row);
                const guppyDoc = row.querySelector(".guppy-render");
                if (guppyDoc && guppyDoc.innerHTML === "ERROR: undefined") {
                    row.querySelector("th").innerHTML = `\$\$${row.getAttribute("data-var")}\$\$`;
                }
            }
        );
        // Guppy.Doc.render_all("text", "$$");
    }
}

function createNewRowHTML(variable) {
    let newRow = `<tr data-var="${variable}"><th>\$\$${handleVarNameSubscripts(variable)}\$\$</th><td>`;
    // add variable equation column
    newRow += `<div id="eqInput-${variable}" class="eqInput varEqInput" data-var="${variable}"></div></td>`;
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
	console.log('TCL: loadVarEquations -> varEquations', varEquations);
    Object.keys(varEquations).forEach((variable) => {
        console.log('TCL: loadVarEquations -> variable', variable);
        const varInput = varInputs[variable];
        const varEquation = varEquations[variable];
        setInputEquation(varInput, varEquation, false);
    })
}