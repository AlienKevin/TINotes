const generateScriptBtn = document.getElementById("generateScriptBtn");
let homeMenu = `Menu(`;
let branching = ``;
const homeMenuTitle = `NOTES`;
homeMenu += `"${homeMenuTitle}"`;
generateScriptBtn.addEventListener("click", exportScript);

function exportScript() {
    const script = generateScript();
    const popupBody = document.querySelector('#popup div.modal-body');
    let viewer = document.getElementById("viewer")
    if (viewer){
        viewer.remove();
    }
    viewer = createFileEditor("viewer");
    viewer.value = script;
    popupBody.appendChild(viewer);
}

function generateScript() {
    for (let i = 0; i < localStorage.length; i++) {
        const itemName = localStorage.key(i);
        console.log('TCL: generateScript -> itemName', itemName);
        const item = JSON.parse(localStorage.getItem(itemName));
        const itemType = item.type;
        console.log('TCL: generateScript -> itemType', itemType);
        const index = i + 1;
        homeMenu += `,"${itemName}",${index}`;
        branching += `Lbl ${index}\n`;
        if (itemType === `file`) {
            branching += `"${item.content}"→Str1\n`;
        }
        branching += `Goto 0\n`;
    }
    homeMenu += `)`;
    const script = `${homeMenu}\n${branching}Lbl 0\n${baseScript}`;
    console.log('TCL: generateScript -> script', script);
    return script;
}