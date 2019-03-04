function dynamicallyLoadScript(s){return new Promise(function(i,n){var e=document.createElement("script");e.src=s,e.onload=i,e.onerror=(()=>n(new Error(`Error when loading ${s}!`))),document.body.appendChild(e)})}window.addEventListener("unhandledrejection",function(s){console.error(s.promise),console.error(s.reason)}),fallback.load({page_css:"lib/fontawesome/css/all.min.css",global_css:"lib/introjs/introjs.min.css",swal:["//unpkg.com/sweetalert/dist/sweetalert.min.js","//cdn.jsdelivr.net/npm/sweetalert","lib/sweetalert/sweetalert.min.js"],Mousetrap:["//cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.2/mousetrap.min.js","lib/mousetrap/mousetrap.min.js"],introJs:["//cdn.jsdelivr.net/npm/intro.js@2.9.3/minified/intro.min.js","//cdnjs.cloudflare.com/ajax/libs/intro.js/2.9.3/intro.min.js","lib/introjs/intro.min.js"],Guppy:["//guppy.js.org/build/guppy.js","lib/guppy-js/guppy.js"],GuppyOSK:["//guppy.js.org/build/guppy_osk.js","lib/guppy-js/guppy_osk.js"],Algebrite:["//cdn.jsdelivr.net/npm/algebrite@1.2.0/dist/algebrite.bundle-for-browser.min.js"],localForge:["//cdn.jsdelivr.net/npm/localforage@1.7.3/dist/localforage.min.js"],utils:"dist/js/utils.js"}),fallback.ready(function(){dynamicallyLoadScript("dist/js/script.js").then(()=>dynamicallyLoadScript("dist/js/equations.js")).then(()=>dynamicallyLoadScript("dist/js/contextMenu.js")).then(()=>dynamicallyLoadScript("TI-BASIC/baseScript.txt")).then(()=>dynamicallyLoadScript("dist/js/generateScript.js")).then(()=>dynamicallyLoadScript("dist/js/popup.js")).then(()=>dynamicallyLoadScript("dist/js/introSteps.js")).then(()=>dynamicallyLoadScript("dist/js/notebookMenu.js"))});
//# sourceMappingURL=../../maps/js/load.js.map
