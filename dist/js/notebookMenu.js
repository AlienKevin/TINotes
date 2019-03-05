localforage.setDriver([localforage.WEBSQL,localforage.INDEXEDDB]);const metaInfo=localforage.createInstance({name:"metaInfo"});metaInfo.setDriver([localforage.WEBSQL,localforage.INDEXEDDB]),localforage.iterate((e,o)=>{console.log(o,e)});const toggleBtn=document.querySelector("#hamburger-icon.toggle-btn"),sidebar=document.getElementById("sidebar"),notebookMenu=sidebar.querySelector("ul"),addNotebookBtn=document.getElementById("addNotebookBtn");toggleBtn.addEventListener("click",e=>{e.preventDefault(),sidebar.classList.toggle("active"),toggleBtn.classList.toggle("active")});let selectedNotebookName,notebookNameList=[];const defaultNotebookName="notebook1";function storeMetaInfo(){return metaInfo.clear().then(()=>Promise.all([setMetaInfo("notebookNameList",notebookNameList),setMetaInfo("selectedNotebookName",selectedNotebookName)]))}function loadMetaInfo(){return Promise.all([getMetaInfo("notebookNameList").then(e=>{e&&(notebookNameList=e)}),getMetaInfo("selectedNotebookName").then(e=>{e&&(selectedNotebookName=e)})])}function setMetaInfo(e,o){return metaInfo.setItem(e,o).catch(function(e){console.log(e)})}function getMetaInfo(e){return metaInfo.getItem(e).catch(function(e){console.log(e)})}function storeSelectedNotebook(){const e=getCurrentNotebook();return setNotebookInStorage(selectedNotebookName,e)}function addNotebook(e){const o=createItemNameInput("notebook");e?(insertAfter(e,o),e.remove()):notebookMenu.appendChild(o),o.focus(),o.addEventListener("keypress",e=>{if(13==e.keyCode){const e=o.value.trim();notebookNameList.indexOf(e)>=0?createErrorMessage(o,"Duplicated notebook name"):0===e.length?createErrorMessage(o,"Notebook name cannot be empty"):(notebookNameList.push(e),displayNotebookLabel(e,o),o.remove(),setSelectedNotebook(e))}})}function setSelectedNotebook(e,o){const t={...{storePrevious:!0,storeSelected:!0},...o},n=t.storePrevious,a=t.storeSelected,r=notebookMenu.querySelector(`li[data-name="${selectedNotebookName}"]`);function l(){selectedNotebookName=e,notebookMenu.querySelector(`li[data-name="${e}"`).classList.add("selected"),loadNotebook(e)}r&&(console.log("TCL: setSelectedNotebook -> oldSelectedNotebook",r),r.classList.remove("selected")),n||(selectedNotebookName=e),a?storeSelectedNotebook().then(()=>{l()}):l(),storeMetaInfo()}function addDefaultNotebook(){console.log("TCL: addDefaultNotebook -> addDefaultNotebook"),displayNotebookLabel(defaultNotebookName),notebookNameList.push(defaultNotebookName),setSelectedNotebook(defaultNotebookName,{storePrevious:!1})}function loadNotebook(e){clearSelectedNotebook(),getNotebookFromStorage(e).then(e=>{e instanceof Object&&(Object.keys(e).forEach(o=>{const t=e[o];setItemInStorage(o,t)}),updateAtPosition(homePosition))})}function loadNotebookMenu(){console.log("TCL: loadNotebookMenu -> notebookNameList",notebookNameList),notebookNameList.forEach(e=>{console.log("TCL: loadNotebookMenu -> notebookName",e),displayNotebookLabel(e)}),setSelectedNotebook(selectedNotebookName,{storePrevious:!1,storeSelected:!1})}function getCurrentNotebook(){const e={};return Object.keys(localStorage).forEach(o=>{e[o]=getItemFromStorage(o)}),e}function renameNotebook(e){const o=e.innerHTML,t=createItemNameInput("notebook");insertAfter(e,t),t.focus(),e.remove(),t.addEventListener("keypress",e=>{if(13==e.keyCode){const e=t.value;notebookNameList.indexOf(e)>=0&&e!==o?createErrorMessage(t,"Duplicated notebook name"):(replaceElementInArray(notebookNameList,o,e),renameNotebookInStorage(o,e),displayNotebookLabel(e,t),t.remove(),setSelectedNotebook(e))}})}function displayNotebookLabel(e,o){const t=document.createElement("li");t.classList.add("item"),t.classList.add("notebook"),t.setAttribute("data-name",e),t.textContent=e,o?insertAfter(o,t):notebookMenu.appendChild(t)}function renameNotebookInStorage(e,o){getNotebookFromStorage(e).then(e=>setNotebookInStorage(o,e)),removeNotebookFromStorage(e)}function removeNotebook(e){const o=e.getAttribute("data-name");console.log("TCL: removeNotebook -> notebookName",o),removeNotebookFromStorage(o).then(()=>{console.log(`Doing further operations after removing ${o}...`),selectedNotebookName===o&&(clearSelectedNotebook(),console.log("TCL: removeNotebook -> clearSelectedNotebook"));const t=notebookNameList.indexOf(o);let n;t<notebookNameList.length-1?n=notebookNameList[t+1]:t>0?n=notebookNameList[t-1]:addDefaultNotebook(),n&&(console.log("TCL: removeNotebook -> previousNotebookName",n),setSelectedNotebook(n,{storePrevious:!1})),removeElementInArray(notebookNameList,o),e.remove()})}function clearSelectedNotebook(){clearAllItems(),localStorage.clear()}function removeNotebookFromStorage(e){return console.log("TCL: removeNotebookFromStorage -> removeNotebookFromStorage",e),localforage.removeItem(e).catch(function(e){console.log(e)})}function getNotebookFromStorage(e){return localforage.getItem(e)}function setNotebookInStorage(e,o){return localforage.setItem(e,o).catch(e=>{console.log(e)})}function clearAllStorage(){notebookNameList=[],localStorage.clear(),localforage.clear(),metaInfo.clear()}loadMetaInfo().then(()=>{const e=notebookNameList.length;console.log("TCL: notebookSize",e),e>0?loadNotebookMenu():addDefaultNotebook()}),setInterval(function(){storeSelectedNotebook()},1e3),notebookMenu.addEventListener("click",e=>{const o=e.target;if(o.classList.contains("notebook")){o.classList.add("selected"),setSelectedNotebook(o.getAttribute("data-name"))}}),addNotebookBtn.addEventListener("click",()=>{addNotebook()}),window.addEventListener("beforeunload",e=>"");
//# sourceMappingURL=../../maps/js/notebookMenu.js.map
