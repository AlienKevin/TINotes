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
let selectedNotebookName = defaultNotebookName; // store the selected notebook name

countNotebooks().then((notebookSize) => {
    console.log('TCL: notebookSize', notebookSize);
    if (notebookSize > 0) {
        // load notebooks in storage
        loadNotebookMenu();
    } else {
        // add default notebook
        addDefaultNotebook();
    }
});

// select notebook on click
notebookMenu.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("notebook")) {
        target.classList.add("selected");
        const selectedNotebookName = target.getAttribute("data-name");
        setSelectedNotebook(selectedNotebookName);
    }
});

// add new notebook
addNotebookBtn.addEventListener("click", () => {
    addNotebook();
})

// store notebook when window is unloaded
window.addEventListener("beforeunload", (e) => {
    const currentNotebook = getCurrentNotebook();
    // setNotebookInStorage(selectedNotebookName, currentNotebook);
})

function addNotebook(previousNotebookLabel) {
    const notebookNameInput = createItemNameInput("notebook");
    if (previousNotebookLabel) {
        insertAfter(previousNotebookLabel, notebookNameInput);
        previousNotebookLabel.remove();
    } else {
        notebookMenu.appendChild(notebookNameInput);
    }
    notebookNameInput.focus();
    notebookNameInput.addEventListener("keypress", (e) => {
        if (e.keyCode == 13) { // ENTER key
            const newNotebookName = notebookNameInput.value;
            if (notebookNameList.indexOf(newNotebookName) >= 0 && newNotebookName !== oldNotebookName) { // repeated name
                createErrorMessage(notebookNameInput,
                    `Duplicated notebook name`);
            } else {
                displayNotebookLabel(newNotebookName, notebookNameInput);
                // remove item name input
                notebookNameInput.remove();
                // rename selected notebook
                setSelectedNotebook(newNotebookName);
            }
        }
    })
}

function setSelectedNotebook(notebookName) {
    // store previously selected notebook
    setNotebookInStorage(selectedNotebookName, getCurrentNotebook()).then(() => {
        const oldSelectedNotebook = notebookMenu.querySelector(`li[data-name="${selectedNotebookName}"]`);
        if (oldSelectedNotebook) {
            console.log('TCL: setSelectedNotebook -> oldSelectedNotebook', oldSelectedNotebook);
            oldSelectedNotebook.classList.remove("selected");
        }
        // switch to newly selected notebook
        selectedNotebookName = notebookName;
        const notebookLabel = notebookMenu.querySelector(`li[data-name="${notebookName}"`);
        notebookLabel.classList.add("selected");
        // load the selected notebook
        loadNotebook(notebookName);
    });
}

// display and store the default notebook
function addDefaultNotebook() {
    // store the default book
    setNotebookInStorage(defaultNotebookName, getCurrentNotebook());
    // display the default notebook
    displayNotebookLabel(defaultNotebookName);
    notebookNameList.push(defaultNotebookName);
    // set selected notebook to the default one
    setSelectedNotebook(defaultNotebookName);
}

function loadNotebook(notebookName) {
    clearSelectedNotebook();
    getNotebookFromStorage(notebookName).then((notebook) => {
        Object.keys(notebook).forEach(itemName => {
            const item = notebook[itemName];
            setItemInStorage(itemName, item);
        });
        updateAtPosition(homePosition);
    });
}

function loadNotebookMenu() {
    let lastNotebookName;
    localforage.iterate(function (notebook, notebookName) {
        console.log('TCL: loadNotebookMenu -> notebookName', notebookName);
        notebookNameList.push(notebookName);
        displayNotebookLabel(notebookName);
        lastNotebookName = notebookName;
    }).then(
        () => {
            console.log('TCL: loadNotebookMenu -> lastNotebookName', lastNotebookName);
            setSelectedNotebook(lastNotebookName);
        }
    ).catch(function (err) {
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

function removeNotebook(notebookLabel) {
    const notebookName = notebookLabel.getAttribute("data-name");
    console.log('TCL: removeNotebook -> notebookName', notebookName);
    removeNotebookFromStorage(notebookName);
    const removedNotebookIndex = notebookNameList.indexOf(notebookName);
    if (removedNotebookIndex > 0) {
        const previousNotebookName = notebookNameList[removedNotebookIndex - 1];
        setSelectedNotebook(previousNotebookName);
    }
    removeElementInArray(notebookNameList, notebookName);
    notebookLabel.remove();
    if (selectedNotebookName === notebookName) {
        clearSelectedNotebook();
    }
}

// Remove all items from storage and delete all labels!!!
function clearSelectedNotebook() {
    clearAllItems();
    localStorage.clear();
}

function removeNotebookFromStorage(notebookName) {
    return localforage.removeItem(notebookName).catch(function (err) {
        console.log(err);
    });
}

function getNotebookFromStorage(notebookName) {
    return localforage.getItem(notebookName);
}

function setNotebookInStorage(notebookName, notebook) {
    return localforage.setItem(notebookName, notebook).catch(err => {
        console.log(err);
    });
}

function countNotebooks() {
    return localforage.length();
}