// Here we actually invoke Fallback JS to retrieve the following libraries for the page.
fallback.load({
            // Include your stylesheets, this can be an array of stylesheets or a string!
            page_css: 'lib/fontawesome/css/all.min.css', // load local font awesome library
            global_css: 'lib/introjs/introjs.min.css',  // load introjs css

            // JavaScript library. THE KEY MUST BE THE LIBRARIES WINDOW VARIABLE!
            // load sweet alert for beautiful popups: https://github.com/t4t5/sweetalert
            'swal': [
                '//unpkg.com/sweetalert/dist/sweetalert.min.js',
                '//cdn.jsdelivr.net/npm/sweetalert',
                'lib/sweetalert/sweetalert.min.js'
            ],

            // load Mousetrap for keyboard shortcuts: https://github.com/ccampbell/mousetrap
            'Mousetrap': [
                '//cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.2/mousetrap.min.js',
                'lib/mousetrap/mousetrap.min.js',
            ],

            // load introjs for step-by-step introduction to my web app:
            // https://github.com/usablica/intro.js
            'introJs': [
                '//cdn.jsdelivr.net/npm/intro.js@2.9.3/minified/intro.min.js',
                '//cdnjs.cloudflare.com/ajax/libs/intro.js/2.9.3/intro.min.js',
                'lib/introjs/intro.min.js'
            ],

            'Guppy': [
                '//guppy.js.org/build/guppy.js',
                'lib/guppy-js/guppy.js',
            ],
            'GuppyOSK': [
                '//guppy.js.org/build/guppy_osk.js',
                'lib/guppy-js/guppy_osk.js',
            ],
            'Algebrite': [
                '//cdn.jsdelivr.net/npm/algebrite@1.2.0/dist/algebrite.bundle-for-browser.min.js',
            ],
            'localForge': [
                '//cdn.jsdelivr.net/npm/localforage@1.7.3/dist/localforage.min.js',
            ],
            'utils': 'dist/js/utils.js',

        }); 
        fallback.ready(function () {
            dynamicallyLoadScript("dist/js/script.js");
            dynamicallyLoadScript("dist/js/equations.js");
            dynamicallyLoadScript("dist/js/contextMenu.js");
            dynamicallyLoadScript("TI-BASIC/baseScript.txt");
            dynamicallyLoadScript("dist/js/generateScript.js");
            dynamicallyLoadScript("dist/js/popup.js");
            dynamicallyLoadScript("dist/js/introSteps.js");
            dynamicallyLoadScript("dist/js/notebookMenu.js");
        });

        function dynamicallyLoadScript(url) {
            var script = document.createElement("script"); // create a script DOM node
            script.src = url; // set its src to the provided URL
            document.body.appendChild(script); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
        }