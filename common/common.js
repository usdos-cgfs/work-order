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

//Add a method for peeking the last element of an array
// Similar to .pop(), but doesn't remove the element
// Array.prototype.peek = function() {
//    return this[this.length - 1];
// }

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
