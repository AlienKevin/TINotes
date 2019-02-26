/************************* From equations.js *************************/

// Source: https://stackoverflow.com/a/9792947/6798201
function deleteStrInArray(str, array) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === str) {
            array.splice(i, 1);
        }
    }
}

function findClosingBracketMatchIndex(str, pos) {
    if (str[pos] != '(') {
        throw new Error("No '(' at index " + pos);
    }
    let depth = 1;
    for (let i = pos + 1; i < str.length; i++) {
        switch (str[i]) {
            case '(':
                depth++;
                break;
            case ')':
                if (--depth == 0) {
                    return i;
                }
                break;
        }
    }
    return -1; // No matching closing parenthesis
}

// Check if an equation is a constant or not
function isConstant(equation) {
    try {
        const value = nerdamer(equation).evaluate().text();
        return isFinite(value);
    } catch (e) {
        return false;
    }
}

/************************* From generateScript.js *************************/

// source: https://stackoverflow.com/a/3561711/6798201
// Escape all special characters in a regular expression string
RegExp.escape = function (s) {
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

// Clone an object containing objects, arrays, strings, booleans and numbers
// but not containing functions
// Source: https://stackoverflow.com/a/10869248/6798201
function clone(obj){
    return JSON.parse(JSON.stringify(obj));
}