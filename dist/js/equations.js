const newEquationBtn=document.getElementById("newEquationBtn"),eqLength=20;let mainInput,varInputs={};const guppyBlacklist=["norm","utf8","text","floor","eval","integral","defintegral","derivative","summation","product","root","vector","point","matrix","infinity","banana","pineapple","kiwi","mango","sinh","cosh","tanh","<=","!=",">=",">","<","!=","zeta","eta","iota","kappa","nu","xi","upsilon","chi","psi","omega","Theta","Lambda","Xi","Pi","Psi"];let warningTimerId;function displayEquation(e,t,n){console.log("displaying equation...");const o=document.getElementById("editField");if(o){o.remove(),o.getAttribute("data-item")!==t&&displayEquation(e,t,n)}else openEquationEditField(t,n,e)}function storeEquation(e,t){t.equation=getMainEquation(!1),t.varEquations=getVarEquations(),t.varDescriptions=getVarDescriptions(),t.constants=getConstants(),setItemInStorage(e,t)}function getConstants(){const e=getVarEquations(),t={};return Object.keys(e).forEach(n=>{const o=e[n];if(isConstant(o)){const e=varInputs[n];t[n]=e.engine.get_content("xml")}}),t}function getVarDescriptions(){const e={};return Array.from(document.getElementsByClassName("descriptionInput")).forEach(t=>{const n=t.getAttribute("data-var");n&&(e[n]=t.value)}),e}function getVarEquations(){const e={};return Object.keys(varInputs).forEach(t=>{document.querySelector(`.eqInput[data-var="${t}"]`)&&(e[t]=getEquation(varInputs[t],t,!0))}),e}guppyOSK=new GuppyOSK,Guppy.use_osk(new GuppyOSK({goto_tab:"arithmetic",attach:"focus"})),newEquationBtn.addEventListener("click",()=>{createMenuItem("equation")}),Mousetrap.bind("shift+e",e=>(newEquationBtn.click(),!1));const equationTextToSymbol={"absolutevalue(":"abs(","squareroot(":"sqrt(","neg(":"-("};function convertTextToSymbol(e){return Object.entries(equationTextToSymbol).forEach(([t,n])=>{e=e.replace(new RegExp(RegExp.escape(t),"g"),n)}),e}function convertSymbolToText(e){return Object.entries(equationTextToSymbol).forEach(([t,n])=>{e=e.replace(new RegExp(RegExp.escape(n),"g"),t)}),e}function getMainEquation(e){try{let t=getEquation(mainInput,"main",e);return console.log("TCL: getEquation -> equation",t),detachWarning(eqInput),t}catch(e){warningTimerId=setTimeout(()=>{AttachWarning(eqInput)},500)}return new Error("error loading equation")}function getEquation(e,t,n){let o="";try{o=e.engine.get_content("text"),console.log("TCL: getEquation -> inputContent",o)}catch(e){AttachWarning(document.querySelector(`.eqInput[data-var="${t}"]`))}let a=convertTextToSymbol(o);return console.log("TCL: getEquation -> equation",a),a=handleSubscripts(a,n),console.log("TCL: getEquation -> equation",a),a}function convertToExponential(e){const t=nerdamer(e).evaluate().text();console.log("TCL: convertToExponential -> value",t);if(isFinite(t)){let e=Number(t).toExponential();const n=(e=e.toUpperCase()).substring(e.indexOf("E")+1);return Math.abs(Number(n))>5?e:t}return e}function getExponent(e){let t=Number(e).toExponential();return(t=t.toUpperCase()).substring(t.indexOf("E")+1)}function handleVarNameSubscripts(e){return e.indexOf("_")>=0?handleSubscripts(`(${e})`,!0):e}function AddParenthesesAroundVarName(e){let t=nerdamer(e).variables();const n={};return(t=t.filter(e=>e.indexOf("_")>=0)).forEach(t=>{const o={},a="_"+t.replace("_","c")+"_";o[t]=a,n[t]=a,e=nerdamer(e,o).text(),console.log("TCL: AddParenthesesAroundVarName -> equation",e)}),t.forEach(t=>{const o="("+t+")";e=e.replace(new RegExp(n[t],"g"),o)}),e}function handleSubscripts(e,t=!0,n=!1){if(e.indexOf("_")>=0){n&&(e=AddParenthesesAroundVarName(e));let o=0,a=e.indexOf("_",o);for(;a>=0;){const n=e.lastIndexOf("(",a);let r,i,s=findClosingBracketMatchIndex(e,n);t?(a+1<e.length&&"("!==e.charAt(a+1)&&(e=insertSubstring(e,a+1,"("),e=insertSubstring(e,s+1,")"),s+=2),r=a+2,i=s-1):(a+1<e.length&&"("===e.charAt(a+1)&&(e=deleteSubstring(e,a+1,1),e=deleteSubstring(e,s-1,1),s-=2),r=a+1,i=s+1);let u="";for(let n=r;n<i;n++){const o=e.substring(n,n+1);"("!==o&&")"!==o&&"*"!=o&&" "!=o&&(u+=o,t&&n<i-1&&(u+="*"))}e=insertSubstring(e,r,u,i-a-2),o=a+1,a=e.indexOf("_",o)}return e}return e}function AttachWarning(e){e.parentNode.querySelector(".warning")||e.insertAdjacentHTML("afterend",'<i class="fa fa-exclamation-triangle warning" aria-hidden="true"></i>')}function detachWarning(e){const t=e.parentNode.querySelector(".warning");t?t.remove():clearTimeout(warningTimerId)}function setMainEquation(e){e&&(console.log("TCL: setEquation -> convertSymbolToText(equation)",convertSymbolToText(e)),setInputEquation(mainInput,e),mainInput.engine.end(),mainInput.activate(),mainInput.render(!0))}function setInputEquation(e,t,n=!1){console.log("TCL: setInputEquation -> equation",t);const o=convertSymbolToText(handleSubscripts(t,!0,n));console.log("TCL: setInputEquation -> processedEquation",o),o?e.import_text(o):(e.engine.sel_all(),e.engine.sel_clear()),e.engine.end(),e.render(!0)}function configureInput(e){e.configure("blacklist",guppyBlacklist),e.configure("cliptype","text"),e.configure("button",["osk","settings","symbols","controls"]),e.event("focus",e=>{e.focused&&(removeExtraGuppyOSKTabs(),document.getElementById("editField").scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"}))})}function configureGuppyHelp(){const e=["int","defi","deriv","mat","vec","sum","prod","leq","geq","less","greater","neq"];document.querySelector("#guppy_syms_table").querySelectorAll("tr").forEach(t=>{const n=t.querySelector("td").innerText;(guppyBlacklist.indexOf(n)>=0||e.indexOf(n)>=0)&&t.remove()})}function createEquationEditor(){const e=document.createElement("div");return e.id="editField",e.classList.add("editor"),e.setAttribute("data-type","equation"),e.insertAdjacentHTML("afterbegin",`<div>\n    <label for="eqInput">Equation: </label>\n    <div id="eqInput" type="text" size="${eqLength}" spellcheck="false"></div>\n    </div>\n    `),e}function removeExtraGuppyOSKTabs(){document.querySelector("#guppy_osk_tab_calculus").remove(),document.querySelector("#guppy_osk_tab_array").remove(),document.querySelector("#guppy_osk_tab_editor").remove(),document.querySelector("#guppy_osk_tab_emoji").remove(),document.querySelector("#guppy_osk_tab_operations").remove(),document.querySelector("body > div.guppy_osk > div.tabbar > div.scroller-left").remove(),document.querySelector("body > div.guppy_osk > div.tabbar > div.scroller-right").remove(),setTimeout(function(){document.querySelector("#functions > span:nth-child(1)").remove(),document.querySelector("#functions > span:nth-child(2)").remove(),document.querySelector("#functions > span:nth-child(4)").remove();for(let e=0;e<4;e++)document.querySelector("#functions > span:nth-child(8)").remove();console.log("removing extra greek letters..."),document.querySelectorAll("#greek span > span.katex-mathml > math > semantics > mrow > mi").forEach(e=>{const t=e.innerHTML;Object.values(conversionTable).indexOf(t)<0&&e.closest("span.guppy_osk_key").remove()}),document.querySelectorAll("#trigonometry span > span > span.katex-mathml > math > semantics > mrow > mi").forEach(e=>{const t=e.innerHTML;["cos","sin","tan","arccos","arcsin","arctan","log","ln"].indexOf(t)<0&&e.closest("span.guppy_osk_key").remove()})},100)}function openEquationEditField(e,t,n){const o=createEquationEditor();o.setAttribute("data-item",e),void 0===n?system.appendChild(o):insertAfter(n,o);const a=document.getElementById("eqInput");function r(e){let t=[];try{t=nerdamer(handleSubscripts(e.replace(/\=/g," "),!1)).variables(),console.log("TCL: getEquationVars -> variables",t),console.log("Handling subscripts in equation vars..."),deleteStrInArray("ln",t)}catch(e){}return t}function i(e){console.log("TCL: createVarTable -> varInfo",e);const t=getMainEquation();detachWarning(a);const n=r(t);let i=document.getElementById("varTable");if(n.length>0){let t="\n            <thead>\n            <tr>\n                <th>Vars</th>\n                <th>Equations</th>\n                <th>Description</th>\n            </tr>\n            </thead>";if(n.forEach(e=>{t+=createNewRowHTML(e)}),i||((i=document.createElement("table")).id="varTable"),i.innerHTML=t,o.appendChild(i),n.forEach(e=>{varInputs[e]=new Guppy(`eqInput-${e}`),configureInput(varInputs[e])}),void 0!==e){const t=e.varEquations;console.log("TCL: createVarTable -> varEquations",t);const n=e.varDescriptions;console.log("TCL: createVarTable -> varDescriptions",n),e&&(loadVarEquations(e),renderEquationVars()),n&&loadVarDescriptions(n)}}}a.classList.add("eqInput"),a.setAttribute("data-var","main"),configureInput(mainInput=new Guppy("eqInput")),configureGuppyHelp(),mainInput.event("change",function(){const e=getMainEquation();console.log("TCL: updateVarTable -> eq",e);let t=r(e);console.log("TCL: updateVarTable -> vars",t);let n=document.getElementById("varTable");if(n){const o=n.querySelectorAll("tbody tr"),a=[];o.forEach(e=>{a.push(e.getAttribute("data-var"))});const r=new RegExp("<m[^>]*><e[^>]*></e></m>"),i=mainInput.engine.get_content("xml");console.log("TCL: updateVarTable -> mainContent",i),console.log("TCL: updateVarTable -> emptyXML.test(mainContent)",r.test(i)),r.test(i)&&n.remove(),t.forEach(t=>{const o=n.getElementsByTagName("tbody")[0];if(a.indexOf(t)<0){const e=createNewRowHTML(t);o.insertAdjacentHTML("beforeend",e),varInputs[t]=new Guppy(`eqInput-${t}`),configureInput(varInputs[t])}console.log("Solving var equations..."),setInputEquation(varInputs[t],solveEquation(e,t),!0)}),t.length>0&&o.forEach(e=>{const n=e.getAttribute("data-var");t.indexOf(n)<0&&e.remove()}),!e instanceof Error&&""===e&&n&&n.remove()}else i();renderEquationVars()}),mainInput.activate(),void 0!==t&&(t.equation&&setMainEquation(t.equation),console.log("Creating Var Table ..."),i(t))}function solveEquation(e,t){const n=nerdamer.solve(convertTextToSymbol(handleSubscripts(e,!1)),t);console.log("TCL: solveEquation -> convertTextToSymbol(handleSubscripts(equation, false))",convertTextToSymbol(handleSubscripts(e,!1)));let o="";return n.symbol&&n.symbol.elements&&n.symbol.elements.some(e=>(console.log("TCL: solveEquation -> element",e.text()),!(e.symbol&&!1!==e.symbol.isImaginary()||!(n.symbol.elements.length>=2&&("#"===e.value?e.gte(0):!1===nerdamer(e.text()).evaluate().text().startsWith("-"))||n.symbol.elements.length<=1))&&(o=Algebrite.simplify(e.text()).toString(),!0))),console.log("TCL: solveEquation -> finalResult",o),o}function renderEquationVars(){console.log("TCL: renderEquationVars -> renderEquationVars");const e=Guppy.Doc.render_all("text","$$");console.log("TCL: renderEquationVars -> result",e);const t=document.getElementById("varTable");t&&t.querySelectorAll("tbody tr").forEach(e=>{console.log("TCL: renderEquationVars -> row",e);const t=e.querySelector(".guppy-render");t&&"ERROR: undefined"===t.innerHTML&&(e.querySelector("th").innerHTML=`$$${e.getAttribute("data-var")}$$`)})}function createNewRowHTML(e){let t=`<tr data-var="${e}"><th>$$${handleVarNameSubscripts(e)}$$</th><td>`;t+=`<div id="eqInput-${e}" class="eqInput varEqInput" data-var="${e}"></div></td>`;const n=lineLength-e.length-1;return t+=`<td><input type="text" class="descriptionInput" \nsize=${n} maxlength=${n} data-var="${e}" spellcheck="false"`,t+="</tr>"}function loadVarDescriptions(e){Array.from(document.getElementsByClassName("descriptionInput")).forEach(t=>{const n=t.getAttribute("data-var");if(n){const o=e[n];o&&(t.value=o)}})}function loadVarEquations(e){const t=e.varEquations,n=e.constants;console.log("TCL: loadVarEquations -> varEquations",t),Object.keys(t).forEach(e=>{console.log("TCL: loadVarEquations -> variable",e);const o=varInputs[e],a=t[e];if(n&&Object.keys(n).indexOf(e)>=0){const t=n[e];o.import_xml(t),o.engine.end(),o.render(!0)}else setInputEquation(o,a,!1)})}