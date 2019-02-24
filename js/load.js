// Here we actually invoke Fallback JS to retrieve the following libraries for the page.
fallback.load({
            // Include your stylesheets, this can be an array of stylesheets or a string!
            page_css: 'fontawesome/css/all.min.css', // load local font awesome library
            global_css: 'introjs/introjs.min.css',  // load introjs css

            // JavaScript library. THE KEY MUST BE THE LIBRARIES WINDOW VARIABLE!
            // load sweet alert for beautiful popups: https://github.com/t4t5/sweetalert
            'swal': [
                '//unpkg.com/sweetalert/dist/sweetalert.min.js',
                '//cdn.jsdelivr.net/npm/sweetalert',
                'sweetalert/sweetalert.min.js'
            ],

            // load Mousetrap for keyboard shortcuts: https://github.com/ccampbell/mousetrap
            'Mousetrap': [
                '//cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.2/mousetrap.min.js',
                'mousetrap/mousetrap.min.js',
            ],

            // load introjs for step-by-step introduction to my web app:
            // https://github.com/usablica/intro.js
            'introJs': [
                '//cdn.jsdelivr.net/npm/intro.js@2.9.3/minified/intro.min.js',
                '//cdnjs.cloudflare.com/ajax/libs/intro.js/2.9.3/intro.min.js',
                'introjs/intro.min.js'
            ],

            'Guppy': [
                '//guppy.js.org/build/guppy.js',
                '/node_modules/guppy-js/guppy.js',
            ],
            'GuppyOSK': [
                '//guppy.js.org/build/guppy_osk.js',
                '/node_modules/guppy-js/guppy_osk.js',
            ],
            'mathjs': [
                '//cdn.jsdelivr.net/npm/mathjs@5.5.0/dist/math.min.js',
                '//cdnjs.cloudflare.com/ajax/libs/mathjs/5.5.0/math.min.js',
            ],
            'utils': 'dist/js/utils.js',

        }, {
            // shim: {
            //     'utils': ['Mousetrap','swal','introJs'],
            // },
        }); 
        fallback.ready(function () {
            dynamicallyLoadScript("dist/js/script.js");
            dynamicallyLoadScript("dist/js/equations.js");
            dynamicallyLoadScript("dist/js/contextMenu.js");
            dynamicallyLoadScript("TI-BASIC/baseScript.txt");
            dynamicallyLoadScript("dist/js/generateScript.js");
            dynamicallyLoadScript("dist/js/popup.js");
        });

        function dynamicallyLoadScript(url) {
            var script = document.createElement("script"); // create a script DOM node
            script.src = url; // set its src to the provided URL
            document.body.appendChild(script); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
        }