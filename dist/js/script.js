let lineLength,rowLength,menuTitleLength,menuItemLength,calculatorType="color";const minMenuItemLength=1,appInfoBtn=document.getElementById("appInfoBtn"),newFolderBtn=document.getElementById("newFolderBtn"),newFileBtn=document.getElementById("newFileBtn"),backBtn=document.getElementById("backBtn"),clearBtn=document.getElementById("clearBtn"),system=document.getElementById("system"),navigationBar=document.getElementById("navigationBar"),homePosition="home";let position="home";const itemNameList=[],types=["file","folder","equation"];let defaultToUppercase=!0,lastFileContent="";const conversionTable={alpha:"α",beta:"β",gamma:"γ",Delta:"Δ",delta:"δ",epsilon:"ε",pi:"π",lambda:"λ",mu:"μ",Omega:"Ω",phat:"p̂",Phi:"Φ",rho:"ρ",Sigma:"Σ",sigma:"σ",tau:"τ","sqrt(":"√(",integral:"∫","<=":"≤",">=":"≥","!=":"≠"};function updateAtPosition(e){iterateStorage(function(t,n,o){t.position===e&&(itemNameList.push(n),displayItem(n,o),updateItemSize(n))})}function displayNavigationBar(){removeAllChildren(navigationBar);const e=position.split("/");for(let t=0;t<e.length;t++)createPositionLabel(e.slice(0,t+1).join("/"))}function createPositionLabel(e){const t=document.createElement("span");t.classList.add("btn"),t.classList.add("positionLabel"),t.innerHTML=getEndOfPosition(e),t.addEventListener("click",()=>{setPosition(e)}),navigationBar.appendChild(t),t.insertAdjacentHTML("afterend",'<i class="far fa-angle-right"></i>')}function changeCalculatorType(){switch(calculatorType){case"monochrome":lineLength=16,rowLength=8;break;case"color":lineLength=26,rowLength=10}menuTitleLength=lineLength,menuItemLength=lineLength-2}function removeItemPlaceholder(){let e=document.getElementById("newItemPlaceholder");e&&e.remove()}function displayItemPlaceholder(){if(removeItemPlaceholder(),0===itemNameList.length){const e=document.createElement("p");e.id="newItemPlaceholder",e.classList.add("btn"),e.innerHTML="Create a New File or Folder",e.addEventListener("click",()=>{swal({title:"Create a file or folder?",buttons:{file:{text:"File",value:"file",className:"blurred centered"},folder:{text:"Folder",value:"folder",className:"blurred centered"}}}).then(e=>{e&&createMenuItem(e)})}),system.appendChild(e)}}function iterateStorage(e){for(let t=0;t<localStorage.length;t++){const n=localStorage.key(t),o=getItemFromStorage(n);e(o,n,o.type,o.position,t)}}function toggleBtnHighlight(e){e.target.classList.contains("btn")&&e.target.classList.toggle("btn-hover")}function createMenuItem(e){if(removeItemPlaceholder(),e=e.toLowerCase(),types.indexOf(e)<0)throw new TypeError(`menu item's type should be either folder or file, not ${e}`);const t=createItemNameInput(e);t.addEventListener("keypress",n=>{if(13==n.keyCode){const n=t.value,o=getFullItemName(n);n.length>=minMenuItemLength?itemNameList.indexOf(o)>=0?createErrorMessage(t,`Duplicated ${e} name, ${e} name must be unique`):(itemNameList.push(o),displayItem(o,e,t),storeNewItem(t,e,position),t.remove()):createErrorMessage(t,`${e} name can't be empty`)}}),system.appendChild(t),t.focus()}function getFullItemName(e){return`${position}/${e}`}function createItemNameInput(e){const t=document.createElement("input");return t.setAttribute("type","text"),t.placeholder=`Enter ${e} name here`,t.maxLength=menuItemLength,t.spellcheck=!1,t.classList.add("itemNameInput"),t.style.display="block",t.style.marginTop=".5em",t.style.marginBottom=".5em",t}function createErrorMessage(e,t){document.querySelectorAll(".error").forEach(e=>{e.remove()});const n=document.createElement("span");n.innerHTML=t,n.classList.add("error"),e.addEventListener("input",()=>{n.remove()}),insertAfter(e,n)}function storeNewItem(e,t,n){console.log("TCL: storeNewItem -> storeNewItem");const o={position:n,type:t},i=`${n}/${e.value}`;switch(console.log("TCL: storeNewItem -> itemName",i),setItemInStorage(i,o),t){case"file":openFileEditField(i,o);break;case"equation":openEquationEditField(i,o)}return i}function clearAllItems(){removeAllChildren(system),itemNameList.length=0}function appendPosition(e){setPosition(`${position}/${e}`)}function setPosition(e){position=e,clearAllItems(),updateAtPosition(e),displayNavigationBar(),displayItemPlaceholder()}function getEndOfPosition(e){return e.substring(e.lastIndexOf("/")+1)}function displayItem(e,t,n){const o=document.createElement("p"),i=getEndOfPosition(e);o.innerHTML="file"===t?"📝":"folder"===t?"📁":'<i class="far fa-calculator"></i>',o.innerHTML+=i,o.classList.add(t),o.classList.add("btn"),o.classList.add("item"),o.setAttribute("data-name",e),o.addEventListener("click",()=>{const n=getItemFromStorage(e),i=document.getElementById("editField");if(i){storeItem(i.getAttribute("data-item"))}"file"===t?displayFile(o,e,n):"folder"===t?getItemFromStorage(e)?setPosition(e):appendPosition(e):"equation"===t&&displayEquation(o,e,n)}),n?insertAfter(n,o):system.appendChild(o)}function storeItem(e){console.log("TCL: storeItem -> itemName",e);const t=getItemFromStorage(e);if(console.log("TCL: storeItem -> item",t),t){const n=t.type;switch(console.log("TCL: storeItem -> itemType",n),n){case"file":storeFile(e,t);break;case"equation":storeEquation(e,t)}}}function createFileEditor(e){const t=document.createElement("textarea");return t.id=e||"editor",t.classList.add("editor"),t.setAttribute("data-type","file"),t.rows=rowLength,t.cols=lineLength+1,t.spellcheck=!1,t}function displayFile(e,t,n){const o=document.getElementById("editField");if(o){o.remove(),o.getAttribute("data-item")!==t&&displayFile(e,t,n)}else openFileEditField(t,n,e)}function deleteItem(e){const t=e.getAttribute("data-name");t&&(removeItemFromStorage(t),removeElementInArray(itemNameList,t)),e.remove();const n=document.getElementById("editField");n&&n.getAttribute("data-item")===t&&n.remove()}function renameItem(e){const t=e.getAttribute("data-name");if(t){const n=getItemFromStorage(t).type,o=createItemNameInput();o.value=getEndOfPosition(t),insertAfter(e,o),o.focus(),e.remove(),o.addEventListener("keypress",e=>{if(13==e.keyCode){const e=getFullItemName(o.value);itemNameList.indexOf(e)>=0&&e!==t?createErrorMessage(o,`Duplicated ${n} name, ${n} name must be unique`):(replaceElementInArray(itemNameList,t,e),renameItemInStorage(t,e),displayItem(e,n,o),o.remove())}})}}function renameItemInStorage(e,t){const n=getItemFromStorage(e);removeItemFromStorage(e),setItemInStorage(t,n)}function removeItemFromStorage(e){localStorage.removeItem(e)}function getItemFromStorage(e){return JSON.parse(localStorage.getItem(e))}function setItemInStorage(e,t){localStorage.setItem(e,JSON.stringify(t))}function convertWordsToSymbols(e){for(const[t,n]of Object.entries(conversionTable))e=e.replace(new RegExp(RegExp.escape("\\"+t),"g"),n);return e}function convertSymbolsToWords(e){for(const[t,n]of Object.entries(conversionTable))e=e.replace(new RegExp(RegExp.escape(n),"g"),"\\"+t);return e}function convertSingleQuotesToDoubleQuotes(e){return e.replace(new RegExp("'","g"),'"')}function convertDoubleQuotesToSingleQuotes(e){return e.replace(new RegExp('"',"g"),"'")}function decodeFileContent(e){let t=convertSpacesToNewlines(e);return t=convertSingleQuotesToDoubleQuotes(t=convertWordsToSymbols(t))}function encodeFileContent(e){let t=convertNewlinesToSpaces(e);return t=convertDoubleQuotesToSingleQuotes(t)}function convertToUppercase(e){let t="";for(let n=0;n<e.length;n++){const o=e[n];/^[a-zA-Z]*$/.test(o)?t+=o.toUpperCase():t+=o}return t}function openFileEditField(e,t,n){const o=createFileEditor();o.placeholder="Write notes here",toUppercase=defaultToUppercase,void 0!==t.content&&(o.value=decodeFileContent(t.content),o.setAttribute("data-item",e),/[a-z]+/.test(o.value)&&(toUppercase=!1)),o.addEventListener("input",()=>{let t=o.value;if(t=convertWordsToSymbols(t),toUppercase&&t.indexOf("\\")<0&&(t=convertToUppercase(t)),updateItemSize(e,t),t.length-lastFileContent.length>lineLength){let e=lastFileContent.lastIndexOf("\n");for(let n=0;n<t.length;n++)n-e===lineLength&&(t=insertSubstring(t,n+1,"\n"),e=++n)}else if(t.length>=lastFileContent.length){t.length-t.lastIndexOf("\n")-1>lineLength&&(t=insertSubstring(t,t.length-1,"\n",0))}o.value=t,lastFileContent=t});const i=document.createElement("div");i.id="editFieldControl";const a=document.createElement("span");a.id="submitFileBtn",a.classList.add("btn"),a.innerHTML="Submit",a.addEventListener("click",()=>{storeFile(e,t),r.remove()}),Mousetrap(o).bind("mod+s",function(e,t){return a.click(),!1});const r=document.createElement("div");r.id="editField",r.setAttribute("data-item",e),void 0===n?system.appendChild(r):insertAfter(n,r),r.appendChild(o),r.appendChild(i),i.appendChild(a),i.insertAdjacentHTML("beforeend",'<div id="uppercaseDiv">\n            <input type="checkbox" id="uppercaseCheckBox">\n            <label for="uppercaseCheckBox">Uppercase</label>\n            <i class="far fa-info-circle infoBtn" id="uppercaseInfoBtn"></i>\n        </div>');const l=document.getElementById("uppercaseCheckBox");l.checked=toUppercase,l.addEventListener("change",()=>{l.checked!==toUppercase&&(toUppercase=l.checked,o.value=convertToUppercase(o.value))}),document.getElementById("uppercaseInfoBtn").addEventListener("click",()=>{swal({title:"Why does the text need to be in uppercase?",text:'1. Some lowercase words are predefined as keywords, like "and", "sin(", etc. in TI. Thus, their length cannot be accurately determined because keywords all occupy one space in TI. This can mess up note layout and hide some parts of the note. \n            2. Uppercase letters (1 byte each) take up less spaces than lowercase letters (2 bytes each).\n            Sugguestion: You should stick with uppercase in all your notes.',buttons:"okay"})}),o.focus()}function storeFile(e,t){let n=document.getElementById("editor").value;console.log("TCL: storeFile -> content",n),n=encodeFileContent(n),t.content=n,setItemInStorage(e,t),updateItemSize(e,n)}function updateItemSize(e,t){const n=document.querySelector(`p[data-name="${e}"]`),o=`${countItemSize(e,t)} bits`,i=n.getElementsByClassName("sizeLabel");i[0]?i[0].innerHTML=o:n.insertAdjacentHTML("beforeend",`<span style="float:right;" class="sizeLabel">${o}</span>`)}function countItemSize(e,t){const n=getItemFromStorage(e);return void 0===t&&(t=n.content),"file"===n.type?countFileSize(t):countFolderSize(e)}function countFolderSize(e){let t=0;return iterateStorage(function(n,o,i,a,r){a===e&&(t+="file"===i?countFileSize(n.content):countFolderSize(o))}),t}function countFileSize(e){let t=0;if(e)for(let n=0;n<e.length;n++){const o=e[n];/[0-9A-Z{}()[\],.!?+\-*\/^:=<>≤≥≠π√ ]/.test(o)?t+=1:t+=2}return 8*t}function convertNewlinesToSpaces(e){let t=e,n=0,o=t.indexOf("\n");for(;o>=0&&n<t.length&&!((o=t.indexOf("\n",n))<0);){console.log("newlineIndex:"+o);const e=lineLength-(o-n);let i="";for(let t=0;t<e;t++)i+=" ";t=t.slice(0,o)+i+t.slice(o+1),console.log("str: "+t),n=o+e,console.log("previousNewlineIndex: "+n)}return t}function convertSpacesToNewlines(e){let t=e,n=lineLength-1;for(;n<t.length;)" "===t[n]?(t=deleteSubstring(t,n,1),n--):(t=insertSubstring(t,n+1,"\n",0),n+=lineLength+1);return t}displayNavigationBar(),changeCalculatorType(),document.querySelector(`input#${calculatorType}`).setAttribute("checked",!0),document.querySelectorAll('input[name="calculatorType"]').forEach(e=>{e.addEventListener("change",e=>{calculatorType=e.target.value,changeCalculatorType()})}),updateAtPosition("home"),displayItemPlaceholder(),appInfoBtn.addEventListener("click",()=>{introJs().setOptions({tooltipPosition:"bottom",showStepNumbers:!1,hidePrev:!0,hideNext:!0,showProgress:!0}).start()}),newFolderBtn.addEventListener("click",()=>{createMenuItem("folder")}),Mousetrap.bind("shift+f",e=>(newFolderBtn.click(),!1)),newFileBtn.addEventListener("click",()=>{createMenuItem("file")}),Mousetrap.bind("shift+t",e=>(newFileBtn.click(),!1)),backBtn.addEventListener("click",()=>{iterateStorage(function(e,t,n,o,i){t===position&&setPosition(o)})}),Mousetrap.bind("backspace",()=>{backBtn.click()}),clearBtn.addEventListener("click",()=>{swal({title:"Are you sure?",text:"Once deleted, you will not be able to recover this folder!",icon:"warning",buttons:!0,dangerMode:!0}).then(e=>{if(e){swal("All items are deleted in this folder",{icon:"success",buttons:!1,timer:800});const e=[];iterateStorage(function(t,n,o,i,a){i.startsWith(position)&&e.push(n)}),e.forEach(e=>{removeItemFromStorage(e)}),clearAllItems(),displayItemPlaceholder()}})}),document.addEventListener("mouseover",toggleBtnHighlight),document.addEventListener("mouseout",toggleBtnHighlight);