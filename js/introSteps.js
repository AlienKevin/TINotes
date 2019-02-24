(function () {
    const appInfoBtn = document.getElementById("appInfoBtn");
    // set up information button
    appInfoBtn.addEventListener("click", () => {
        const introjs = introJs().setOptions({
            "steps": [
                {
                    element: "#main",
                    intro: "Hi, welcome to TINotes. TINotes is a note management and viewing system for TI graphing calculators. You can create and store organized notes in a folder system in your TI calculators.",
                },
                {
                    element: "#calculatorTypeSelector",
                    intro: "Select your calculator's display type",
                },
                {
                    element: "#monochromeTypeSelector",
                    intro: "Select Monochrome if you are using TI-83, TI-83 Plus, TI-83 Plus Silver Edition, TI-84 Plus, or TI-84 Plus Silver Edition.",
                },
                {
                    element: "#colorTypeSelector",
                    intro: "Select Color if you are using TI-84 Plus C Silver Edition or TI-84 Plus CE.",
                },
                {
                    element: "#controlPanel",
                    intro: "Here's the control panel of TINotes.",
                },
                {
                    element: "#newFolderBtn",
                    intro: "Create a new folder in current directory (<span class='codeStyle'>Shift+f</span>)",
                },
                {
                    element: "#newFileBtn",
                    intro: "Create a new file in current directory (<span class='codeStyle'>Shift+t</span>)",
                },
                {
                    element: "#newEquationBtn",
                    intro: "Create a new equation in current directory (<span class='codeStyle'>Shift+e</span>)",
                },
                {
                    element: "#generateScriptBtn",
                    intro: `Generate text script for TI Calculators, 
                    <a href='https://github.com/AlienKevin/TINotes#export-notes'>see instructions here</a>
                     on how to load it onto your calculator`,
                },
                {
                    element: "#clearBtn",
                    intro: "Clear all files and folders in the current directory.",
                },
                {
                    element: "#backBtn",
                    intro: "Go back to parent folder (<span class='codeStyle'>Backspace</span>)",
                },
                {
                    element: "#navigationBar",
                    intro: `You can click on the folder name to navigate 
                    to that folder here. For more usage details, please refer to 
                    <a target='_blank' href='https://github.com/AlienKevin/TINotes#tinotes'>the GitHub page</a>.`,
                }
            ],
            "tooltipPosition": "bottom",
            "showStepNumbers": false,
            "hidePrev": true,
            "hideNext": true,
            "showProgress": true,
        });
        introjs.start();
    });
})();