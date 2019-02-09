// Here we actually invoke Fallback JS to retrieve the following libraries for the page.
fallback.load({
    // Include your stylesheets, this can be an array of stylesheets or a string!
    global_css: 'fontawesome/css/all.css',

    // JavaScript library. THE KEY MUST BE THE LIBRARIES WINDOW VARIABLE!
    'swal': [
        '//unpkg.com/sweetalert/dist/sweetalert.min.js',
        '//cdn.jsdelivr.net/npm/sweetalert',
        'sweetalert/sweetalert.min.js'
    ],

    'Mousetrap': [
        '//cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.2/mousetrap.min.js',
        'mousetrap/mousetrap.min.js',
    ]

});
fallback.ready(function(){
    dynamicallyLoadScript("script.js");
    dynamicallyLoadScript("contextMenu.js");
    dynamicallyLoadScript("baseScript.txt");
    dynamicallyLoadScript("generateScript.js");
    dynamicallyLoadScript("popup.js");
});
function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
    document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}