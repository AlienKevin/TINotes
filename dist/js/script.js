let lineLength,rowLength,menuTitleLength,menuItemLength,calculatorType="color";const minMenuItemLength=1,newFolderBtn=document.getElementById("newFolderBtn"),newFileBtn=document.getElementById("newFileBtn"),backBtn=document.getElementById("backBtn"),clearBtn=document.getElementById("clearBtn"),system=document.getElementById("system"),navigationBar=document.getElementById("navigationBar"),homePosition="home";let position=homePosition;const itemNameList=[],types=["file","folder","equation","notebook"];let defaultToUppercase=!0,lastFileContent="";const conversionTable={alpha:"α",beta:"β",gamma:"γ",Delta:"Δ",delta:"δ",epsilon:"ε",pi:"π",lambda:"λ",mu:"μ",Omega:"Ω",phat:"p̂",Phi:"Φ",rho:"ρ",Sigma:"Σ",sigma:"σ",tau:"τ","sqrt(":"√(",integral:"∫","<=":"≤",">=":"≥","!=":"≠"};function updateAtPosition(e){iterateStorage(function(t,n,o){console.log("TCL: updateAtPosition -> item",t),t.position===e&&(itemNameList.push(n),displayItem(n,o),updateItemSize(n))})}function displayNavigationBar(){removeAllChildren(navigationBar),console.log("TCL: displayNavigationBar -> position",position);const e=position.split("/");for(let t=0;t<e.length;t++)createPositionLabel(e.slice(0,t+1).join("/"))}function createPositionLabel(e){console.log("TCL: createPositionLabel -> position",e);const t=document.createElement("span");t.classList.add("btn"),t.classList.add("positionLabel"),t.innerHTML=getEndOfPosition(e),t.addEventListener("click",()=>{setPosition(e),console.log("TCL: createPositionLabel -> position",e)}),navigationBar.appendChild(t),t.insertAdjacentHTML("afterend",'<i class="far fa-angle-right"></i>')}function changeCalculatorType(){switch(calculatorType){case"monochrome":lineLength=16,rowLength=8;break;case"color":lineLength=26,rowLength=10}menuTitleLength=lineLength,menuItemLength=lineLength-2}function removeItemPlaceholder(){let e=document.getElementById("newItemPlaceholder");e&&e.remove()}function displayItemPlaceholder(){if(removeItemPlaceholder(),0===itemNameList.length){const e=document.createElement("p");e.id="newItemPlaceholder",e.classList.add("btn"),e.innerHTML="Create a New File or Folder",e.addEventListener("click",()=>{swal({title:"Create a file or folder?",buttons:{file:{text:"File",value:"file",className:"blurred centered"},folder:{text:"Folder",value:"folder",className:"blurred centered"}}}).then(e=>{console.log("TCL: displayNewItemPlaceholder -> value",e),e&&createMenuItem(e)})}),system.appendChild(e)}}function iterateStorage(e){for(let t=0;t<localStorage.length;t++){const n=localStorage.key(t),o=getItemFromStorage(n);e(o,n,o.type,o.position,t)}}function toggleBtnHighlight(e){e.target.classList.contains("btn")&&e.target.classList.toggle("btn-hover")}function createMenuItem(e){if(removeItemPlaceholder(),e=e.toLowerCase(),types.indexOf(e)<0)throw new TypeError(`menu item's type should be either folder or file, not ${e}`);const t=createItemNameInput(e);t.addEventListener("keypress",n=>{if(13==n.keyCode){const n=t.value,o=getFullItemName(n);n.length>=minMenuItemLength?itemNameList.indexOf(o)>=0?createErrorMessage(t,`Duplicated ${e} name, ${e} name must be unique`):(itemNameList.push(o),displayItem(o,e,t),storeNewItem(t,e,position),t.remove()):createErrorMessage(t,`${e} name can't be empty`)}}),system.appendChild(t),t.focus()}function getFullItemName(e){return`${position}/${e}`}function createItemNameInput(e){const t=document.createElement("input");return t.setAttribute("type","text"),t.placeholder=`Enter ${e} name here`,t.maxLength=menuItemLength,t.spellcheck=!1,t.classList.add("itemNameInput"),t.style.display="block",t.style.marginTop=".5em",t.style.marginBottom=".5em",t}function createErrorMessage(e,t){console.log("TCL: createErrorMessage -> target",e),console.log("TCL: createErrorMessage -> typeof target",typeof e),document.querySelectorAll(".error").forEach(e=>{e.remove()});const n=document.createElement("span");n.innerHTML=t,n.classList.add("error"),e.addEventListener("input",()=>{n.remove()}),insertAfter(e,n)}function storeNewItem(e,t,n){console.log("TCL: storeNewItem -> storeNewItem");const o={position:n,type:t},i=`${n}/${e.value}`;switch(console.log("TCL: storeNewItem -> itemName",i),setItemInStorage(i,o),t){case"file":openFileEditField(i,o);break;case"equation":openEquationEditField(i,o)}return i}function clearAllItems(){removeAllChildren(system),itemNameList.length=0}function appendPosition(e){setPosition(`${position}/${e}`)}function setPosition(e){position=e,clearAllItems(),updateAtPosition(e),displayNavigationBar(),displayItemPlaceholder(),displayTotalSize()}function displayTotalSize(){let e=0;iterateStorage(function(t,n,o,i){i===position&&(e+=countItemSize(n))});const t=document.getElementById("tools");let n=document.getElementById("totalSizeLabel");n||((n=document.createElement("span")).id="totalSizeLabel",t.appendChild(n)),n.innerText=`${e} bits`}function getEndOfPosition(e){return e.substring(e.lastIndexOf("/")+1)}function getStartOfPosition(e){return e.substring(0,e.lastIndexOf("/"))}function displayItem(e,t,n){const o=document.createElement("p"),i=getItemFromStorage(e),l=getEndOfPosition(e);let a="";"file"===t?a="📝":"folder"===t?a="📁":"equation"===t&&(a='<i class="far fa-calculator"></i>'),a+=l,i&&i.link&&(a+='<i class="far fa-link"></i>'),o.innerHTML=a,o.classList.add(t),o.classList.add("btn"),o.classList.add("item"),o.setAttribute("data-name",e),o.addEventListener("click",()=>{const n=document.getElementById("editField");if(n){storeItem(n.getAttribute("data-item"))}"file"===t?displayFile(o,e,i):"folder"===t?(console.log("TCL: displayItem -> position",position),getItemFromStorage(e)?setPosition(e):appendPosition(e),console.log("TCL: displayItem -> position",position)):"equation"===t&&displayEquation(o,e,i)}),n?(console.log("TCL: displayItem -> position",n),insertAfter(n,o)):system.appendChild(o)}function storeItem(e){console.log("TCL: storeItem -> itemName",e);const t=getItemFromStorage(e);if(console.log("TCL: storeItem -> item",t),t){const n=t.type;switch(console.log("TCL: storeItem -> itemType",n),n){case"file":storeFile(e,t);break;case"equation":storeEquation(e,t)}}}function createFileEditor(e){const t=document.createElement("textarea");return t.id=e||"editor",t.classList.add("editor"),t.setAttribute("data-type","file"),t.rows=rowLength,t.cols=lineLength+1,t.spellcheck=!1,t}function displayFile(e,t,n){const o=document.getElementById("editField");if(o){o.remove(),o.getAttribute("data-item")!==t&&displayFile(e,t,n)}else openFileEditField(t,n,e)}function deleteItem(e){if("notebook"===getItemLabelType(e))removeNotebook(e);else{const t=e.getAttribute("data-name");t&&(removeItemFromStorage(t),removeElementInArray(itemNameList,t),removeLink(t)),displayTotalSize(),e.remove();const n=document.getElementById("editField");n&&n.getAttribute("data-item")===t&&n.remove()}}function removeLink(e){iterateStorage(function(t,n){t.link===e&&(delete t.link,setItemInStorage(n,t))})}function renameItem(e){if("notebook"===getItemLabelType(e))renameNotebook(e);else{const t=e.getAttribute("data-name");if(t){const n=getItemFromStorage(t).type,o=createItemNameInput();o.value=getEndOfPosition(t),insertAfter(e,o),o.focus(),console.log("TCL: renameItem -> itemLabel",e),console.log("TCL: renameItem -> itemLabel.parentNode",e.parentNode),e.remove(),o.addEventListener("keypress",e=>{if(13==e.keyCode){const e=getFullItemName(o.value);itemNameList.indexOf(e)>=0&&e!==t?createErrorMessage(o,`Duplicated ${n} name, ${n} name must be unique`):(replaceElementInArray(itemNameList,t,e),renameItemInStorage(t,e),displayItem(e,n,o),o.remove())}})}}}function pinToHome(e){const t=e.getAttribute("data-name"),n=getItemFromStorage(t).type;console.log("TCL: pinToHome -> itemName",t),swal({title:"Give the pinned item a name",buttons:{sameName:{text:"Same Name",value:"sameName"},newName:{text:"New Name",value:"newName"},cancel:"Cancel"}}).then(e=>{switch(e){case"sameName":swal("Pinned to home!",{icon:"success",buttons:!1,timer:800}),linkItemToHome(t);break;case"newName":askForNewLinkedName(t,n)}})}function askForNewLinkedName(e,t){swal({title:"Enter New Name: ",content:{element:"input",attributes:{type:"text",maxLength:lineLength,spellcheck:!1}}}).then(t=>{console.log("TCL: askForNewLinkedName -> newItemName",t),swal(`${t} pinned to home!`,{icon:"success",buttons:!1,timer:800}),linkItemToHome(e,t)})}function linkItemToHome(e,t){console.log("TCL: linkItemToHome -> shortlinkedItemName",t);const n=getItemFromStorage(e);console.log("TCL: linkItemToHome -> originalItem",n),void 0===t&&(t=getEndOfPosition(e));const o=`home/${t}`;if(console.log("TCL: pinToHome -> newItemName",o),getItemNamesAtPosition(homePosition).indexOf(o)>=0||""===t){let n="Duplicated Item Name!";throw console.log("TCL: linkItemToHome -> shortlinkedItemName",t),""===t&&(n="Item name cannot be empty!"),swal({title:n,icon:"warning",button:"OK"}).then(()=>{askForNewLinkedName(e,t)}),new Error("Invalid item name")}console.log("linking the items...");const i=clone(n);console.log("TCL: linkItemToHome -> linkedItem",i),i.position=homePosition,i.link=e,console.log("TCL: linkItemToHome -> linkedItem",i),setItemInStorage(o,i),n.link=o,setItemInStorage(e,n),setPosition(position)}function getItemNamesAtPosition(e){const t=[];return iterateStorage(function(n,o){n.position===e&&t.push(o)}),t}function restrictContextItems(e){const t=document.querySelector('li.context-menu__item[data-action="pinToHome"'),n=(e.getAttribute("data-name"),getItemLabelType(e));console.log("TCL: restrictContextItems -> itemType",n),t&&(t.style.display=position===homePosition||"folder"===n||"notebook"===n?"none":"block")}function getItemLabelType(e){let t;if(console.log("TCL: getItemLabelType -> itemLabel",e),types.forEach(n=>{console.log("TCL: getItemLabelType -> type",n),e.classList.contains(n)&&(t=n)}),void 0===t)throw new Error("Unknown item type!");return t}function renameItemInStorage(e,t){const n=getItemFromStorage(e);removeItemFromStorage(e),setItemInStorage(t,n)}function removeItemFromStorage(e){localStorage.removeItem(e)}function getItemFromStorage(e){return JSON.parse(localStorage.getItem(e))}function setItemInStorage(e,t){if(localStorage.setItem(e,JSON.stringify(t)),t.link){const n=t.link,o=clone(t);o.position=getStartOfPosition(n),o.link=e,localStorage.setItem(n,JSON.stringify(o))}}function convertWordsToSymbols(e){for(const[t,n]of Object.entries(conversionTable))e=e.replace(new RegExp(RegExp.escape("\\"+t),"g"),n);return e}function convertSymbolsToWords(e){for(const[t,n]of Object.entries(conversionTable))e=e.replace(new RegExp(RegExp.escape(n),"g"),"\\"+t);return e}function convertSingleQuotesToDoubleQuotes(e){return e.replace(new RegExp("'","g"),'"')}function convertDoubleQuotesToSingleQuotes(e){return e.replace(new RegExp('"',"g"),"'")}function decodeFileContent(e){let t=convertSpacesToNewlines(e);return t=convertSingleQuotesToDoubleQuotes(t=convertWordsToSymbols(t))}function encodeFileContent(e){let t=convertNewlinesToSpaces(e);return t=convertDoubleQuotesToSingleQuotes(t)}function convertToUppercase(e){let t="";for(let n=0;n<e.length;n++){const o=e[n];/^[a-zA-Z]*$/.test(o)?t+=o.toUpperCase():t+=o}return t}function openFileEditField(e,t,n){const o=createFileEditor();o.placeholder="Write notes here",toUppercase=defaultToUppercase,void 0!==t.content&&(o.value=decodeFileContent(t.content),o.setAttribute("data-item",e),/[a-z]+/.test(o.value)&&(toUppercase=!1)),o.addEventListener("input",()=>{let t=o.value;if(t=convertWordsToSymbols(t),toUppercase&&t.indexOf("\\")<0&&(t=convertToUppercase(t)),updateItemSize(e,t),console.log("TCL: openFileEditField -> content",t),t.length-lastFileContent.length>lineLength){let e=lastFileContent.lastIndexOf("\n");for(let n=0;n<t.length;n++)n-e===lineLength&&(t=insertSubstring(t,n+1,"\n"),e=++n)}else if(t.length>=lastFileContent.length){const e=t.length-t.lastIndexOf("\n")-1;console.log("TCL: openFileEditField -> lastLineLength",e),e>lineLength&&(t=insertSubstring(t,t.length-1,"\n",0)),console.log("TCL: openFileEditField -> content.length",t.length)}o.value=t,lastFileContent=t});const i=document.createElement("div");i.id="editFieldControl";const l=document.createElement("span");l.id="submitFileBtn",l.classList.add("btn"),l.innerHTML="Submit",l.addEventListener("click",()=>{storeFile(e,t),a.remove()}),Mousetrap(o).bind("mod+s",function(e,t){return l.click(),!1});const a=document.createElement("div");a.id="editField",a.setAttribute("data-item",e),void 0===n?system.appendChild(a):insertAfter(n,a),a.appendChild(o),a.appendChild(i),i.appendChild(l),i.insertAdjacentHTML("beforeend",'<div id="uppercaseDiv">\n            <input type="checkbox" id="uppercaseCheckBox">\n            <label for="uppercaseCheckBox">Uppercase</label>\n            <i class="far fa-info-circle infoBtn" id="uppercaseInfoBtn"></i>\n        </div>');const s=document.getElementById("uppercaseCheckBox");s.checked=toUppercase,s.addEventListener("change",()=>{s.checked!==toUppercase&&(toUppercase=s.checked,o.value=convertToUppercase(o.value))}),document.getElementById("uppercaseInfoBtn").addEventListener("click",()=>{swal({title:"Why does the text need to be in uppercase?",text:'1. Some lowercase words are predefined as keywords, like "and", "sin(", etc. in TI. Thus, their length cannot be accurately determined because keywords all occupy one space in TI. This can mess up note layout and hide some parts of the note. \n            2. Uppercase letters (1 byte each) take up less spaces than lowercase letters (2 bytes each).\n            Sugguestion: You should stick with uppercase in all your notes.',buttons:"okay"})}),o.focus()}function storeFile(e,t){let n=document.getElementById("editor").value;console.log("TCL: storeFile -> content",n),n=encodeFileContent(n),t.content=n,setItemInStorage(e,t),updateItemSize(e,n)}function updateItemSize(e,t){const n=document.querySelector(`p[data-name="${e}"]`),o=countItemSize(e,t);console.log("TCL: updateFileSize -> size",o);const i=`${o} bits`,l=n.getElementsByClassName("sizeLabel");l[0]?l[0].innerHTML=i:n.insertAdjacentHTML("beforeend",`<span style="float:right;" class="sizeLabel">${i}</span>`),displayTotalSize()}function countItemSize(e,t){const n=getItemFromStorage(e);return void 0===t&&(t=n.content),"file"===n.type?countFileSize(t):countFolderSize(e)}function countFolderSize(e){let t=0;return iterateStorage(function(n,o,i,l,a){l===e&&(t+="file"===i?countFileSize(n.content):countFolderSize(o))}),t}function countFileSize(e){let t=0;if(e)for(let n=0;n<e.length;n++){const o=e[n];/[0-9A-Z{}()[\],.!?+\-*\/^:=<>≤≥≠π√ ]/.test(o)?t+=1:t+=2}return 8*t}function convertNewlinesToSpaces(e){let t=e,n=0,o=t.indexOf("\n");for(;o>=0&&n<t.length&&!((o=t.indexOf("\n",n))<0);){console.log("newlineIndex:"+o);const e=lineLength-(o-n);let i="";for(let t=0;t<e;t++)i+=" ";t=t.slice(0,o)+i+t.slice(o+1),console.log("str: "+t),n=o+e,console.log("previousNewlineIndex: "+n)}return t}function convertSpacesToNewlines(e){let t=e,n=lineLength-1;for(;n<t.length;)" "===t[n]?(t=deleteSubstring(t,n,1),n--):(t=insertSubstring(t,n+1,"\n",0),n+=lineLength+1);return t}displayNavigationBar(),changeCalculatorType(),document.querySelector(`input#${calculatorType}`).setAttribute("checked",!0),document.querySelectorAll('input[name="calculatorType"]').forEach(e=>{e.addEventListener("change",e=>{calculatorType=e.target.value,changeCalculatorType(),console.log("TCL: e.target",e.target)})}),updateAtPosition(homePosition),displayItemPlaceholder(),newFolderBtn.addEventListener("click",()=>{createMenuItem("folder")}),Mousetrap.bind("shift+f",e=>(newFolderBtn.click(),!1)),newFileBtn.addEventListener("click",()=>{createMenuItem("file")}),Mousetrap.bind("shift+t",e=>(newFileBtn.click(),!1)),backBtn.addEventListener("click",()=>{iterateStorage(function(e,t,n,o,i){t===position&&setPosition(o)})}),Mousetrap.bind("backspace",()=>{backBtn.click()}),clearBtn.addEventListener("click",()=>{swal({title:"Are you sure?",text:"Once deleted, you will not be able to recover this folder!",icon:"warning",buttons:!0,dangerMode:!0}).then(e=>{if(e){swal("All items are deleted in this folder",{icon:"success",buttons:!1,timer:800}),console.log("TCL: position",position);const e=[];iterateStorage(function(t,n,o,i,l){console.log("TCL: itemPosition",i),console.log("TCL: itemName",n),i.startsWith(position)&&e.push(n)}),e.forEach(e=>{removeItemFromStorage(e)}),clearAllItems(),displayItemPlaceholder()}})}),document.addEventListener("mouseover",toggleBtnHighlight),document.addEventListener("mouseout",toggleBtnHighlight);
//# sourceMappingURL=../../maps/js/script.js.map
