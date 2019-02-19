/************************* From equations.js *************************/

// Source: https://stackoverflow.com/a/9792947/6798201
function deleteStrInArray(str, array) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === str) {
            array.splice(i, 1);
        }
    }
}

/************************* From generateScript.js *************************/

// source: https://stackoverflow.com/a/3561711/6798201
// Escape all special characters in a regular expression string
function escapeRegExp(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/************************* From script.js *************************/

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Source: https://stackoverflow.com/a/9792947/6798201
// Remove one element in array, only remove
// the first occurance starting from the end of the array
// uncomment break to remove all occurance
function removeElementInArray(array, element) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === element) {
            array.splice(i, 1);
            break;
        }
    }
}

// Based on: https://stackoverflow.com/a/9792947/6798201
// Replace one element in array with new element, only replace 
// the first occurance starting from the end of the array
// uncomment break to replace all occurance
function replaceElementInArray(array, oldElement, newElement) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === oldElement) {
            array.splice(i, 1, newElement);
            break;
        }
    }
}

// source: https://stackoverflow.com/a/4793630/6798201
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertSubstring(str, index, insertedString, deleteLength = 0) {
    return str.slice(0, index) + insertedString + str.slice(index + deleteLength);
}

function deleteSubstring(str, index, deleteLength = 0) {
    return insertSubstring(str, index, "", deleteLength);
}