const generateScriptBtn = document.getElementById("generateScriptBtn");
generateScriptBtn.addEventListener("click", exportScript);

function exportScript() {
    const script = generateScript();
    const popupBody = document.querySelector('#popup div.modal-body');
    let viewer = document.getElementById("viewer")
    if (viewer) {
        viewer.remove();
    }
    viewer = createFileEditor("viewer");
    viewer.value = script;
    viewer.readOnly = true;
    popupBody.appendChild(viewer);
}

function generateScript() {
    const homeMenuTitle = `NOTES`;
    let homeMenu = `Menu("${homeMenuTitle}"`;
    let branching = ``;
    iterateStorage(function (item, itemName, itemType, position, index) {
        index += 1;
        homeMenu += `,"${itemName}",${index}`;
        branching += `Lbl ${index}\n`;
        if (itemType === `file`) {
            branching += `"${item.content}"→Str1\n`;
        }
        branching += `Goto 0\n`;
    });
    homeMenu += `)`;
    const script = `${homeMenu}\n${branching}Lbl 0\n${baseScript}`;
    // console.log('TCL: generateScript -> script', script);
    return script;
}