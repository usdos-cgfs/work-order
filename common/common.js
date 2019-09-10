/* 
    viewmodel.js

    Define the viewmodels that we will be using for the application.
    This will be included on every page, so let's load it up.

*/
/*****************************************************************************/
/*                          Bindings                                         */
/*****************************************************************************/


/*****************************************************************************/
/*                          Models                                           */
/*****************************************************************************/
window.console = window.console || { log: function () { } };

function convertModelToViewfield(model) {
    vf = "<ViewFields>";
    for (i=0; i<model.length; i++) {
        vf = vf + "<FieldRef Name='" + model[i] + "'/>";
    };

    vf += "</ViewFields>";

    return vf;
}

var pageViewModel = [
    'Title', 'ViewArea', 'ViewBody', 
];

var linkViewModel = [
    'Title', 'LinkType', 'LinkUrl',
];
