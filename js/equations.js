// button for creating a new equation
const newEquationBtn = document.getElementById("newEquationBtn");
newEquationBtn.addEventListener("click", () => {
    
})
Mousetrap.bind("shift+e", (e) => { // keyboard shortcut
    newEquationBtn.click();
    return false;
});