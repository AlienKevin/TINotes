const toggleBtn = document.querySelector('#hamburger-icon.toggle-btn');
const sidebar = document.getElementById("sidebar");
const notebookMenu = sidebar.querySelector("ul");
const addNotebookBtn = document.getElementById("addNotebookBtn");
toggleBtn.addEventListener("click", (event) => {
    event.preventDefault(); // prevent scrolling up to top
    sidebar.classList.toggle("active");
    toggleBtn.classList.toggle("active");
});
let currentNotebookName;
const defaultNotebookName = "notebook1";
const notebookNameList = [];
let selected = defaultNotebookName; // store the selected notebook name

countNotebooks().then((notebookSize) => {
	console.log('TCL: notebookSize', notebookSize);
    if (notebookSize > 0) {
        // load notebooks in storage
        loadNotebooks();
    } else{
        // add default notebook
        addDefaultNotebook();
    }
});

// select notebook on click
notebookMenu.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("notebook")){
        target.classList.add("selected");
        const selectedNotebookName = target.getAttribute("data-name");
        setSelectedNotebook(selectedNotebookName);
    }
});

function setSelectedNotebook(notebookName){
    selected = notebookName;
    const oldSelectedNotebook = notebookMenu.querySelector(`li.selected`);
    oldSelectedNotebook.classList.remove("selected");
    const notebook = notebookMenu.querySelector(`li[data-name="${notebookName}"`);
    notebook.classList.add("selected");
}

// display and store the default notebook
function addDefaultNotebook() {
    // store the default book
    setNotebookInStorage(defaultNotebookName, getCurrentNotebook());
    // display the default notebook
    displayNotebookLabel(defaultNotebookName);
    notebookNameList.push(defaultNotebookName);
    currentNotebookName = defaultNotebookName;
    // set selected notebook to the default one
    setSelectedNotebook(defaultNotebookName);
}

function loadNotebooks() {
    localforage.iterate(function (notebook, notebookName) {
        notebookNameList.push(notebookName);
        displayNotebookLabel(notebookName);
    }).catch(function (err) {
        console.log(err);
    });
}

function getCurrentNotebook() {
    const notebook = {};
    Object.keys(localStorage).forEach(key => {
        console.log('TCL: key', key);
        notebook[key] = getItemFromStorage(key);
    })
    return notebook;
}

function renameNotebook(notebookLabel) {
    const oldNotebookName = notebookLabel.innerHTML;
    const notebookNameInput = createItemNameInput("notebook");
    insertAfter(notebookLabel, notebookNameInput);
    notebookNameInput.focus();
    notebookLabel.remove();
    notebookNameInput.addEventListener("keypress", (e) => {
        if (e.keyCode == 13) { // ENTER key
            const newNotebookName = notebookNameInput.value;
            if (notebookNameList.indexOf(newNotebookName) >= 0 && newNotebookName !== oldNotebookName) { // repeated name
                createErrorMessage(notebookNameInput,
                    `Duplicated notebook name`);
            } else {
                replaceElementInArray(notebookNameList, oldNotebookName, newNotebookName);
                renameNotebookInStorage(oldNotebookName, newNotebookName);
                displayNotebookLabel(newNotebookName, notebookNameInput);
                // remove item name input
                notebookNameInput.remove();
                // rename selected notebook
                setSelectedNotebook(newNotebookName);
            }
        }
    })
}

function displayNotebookLabel(notebookName, labelPosition) {
    const notebookLabel = document.createElement("li");
    notebookLabel.classList.add("item");
    notebookLabel.classList.add("notebook");
    notebookLabel.setAttribute("data-name", notebookName);
    notebookLabel.textContent = notebookName;
    if (labelPosition) {
        insertAfter(labelPosition, notebookLabel);
    } else {
        notebookMenu.appendChild(notebookLabel);
    }
}

function renameNotebookInStorage(oldNotebookName, newNotebookName) {
    getNotebookFromStorage(oldNotebookName)
        .then((notebook) => setNotebookInStorage(newNotebookName, notebook));
    removeNotebookFromStorage(oldNotebookName);
}

function removeNotebook(notebookLabel){
    const notebookName = notebookLabel.getAttribute("data-name");
    removeNotebookFromStorage(notebookName);
    removeElementInArray(notebookNameList, notebookName);
    notebookLabel.remove();
    if (currentNotebookName === notebookName){
        clearCurrentNotebook();
    }
}

// Remove all items from storage and delete all labels!!!
function clearCurrentNotebook(){
    clearAllItems();
    localStorage.clear();
}

function removeNotebookFromStorage(notebookName) {
    localforage.removeItem(notebookName).catch(function (err) {
        console.log(err);
    });
}

function getNotebookFromStorage(notebookName) {
    return localforage.getItem(notebookName);
}

function setNotebookInStorage(notebookName, notebook) {
    localforage.setItem(notebookName, notebook).catch(err => {
        console.log(err);
    });
}

function countNotebooks() {
    return localforage.length();
}