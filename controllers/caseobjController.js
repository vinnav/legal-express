var caseobj = require('../models/caseobj');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all caseobjs.
exports.caseobj_list = function(req, res) {
    res.send('NOT IMPLEMENTED: caseobj list');
};

// Display detail page for a specific caseobj.
exports.caseobj_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: caseobj detail: ' + req.params.id);
};

// Display caseobj create form on GET.
exports.caseobj_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: caseobj create GET');
};

// Handle caseobj create on POST.
exports.caseobj_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: caseobj create POST');
};

// Display caseobj delete form on GET.
exports.caseobj_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: caseobj delete GET');
};

// Handle caseobj delete on POST.
exports.caseobj_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: caseobj delete POST');
};

// Display caseobj update form on GET.
exports.caseobj_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: caseobj update GET');
};

// Handle caseobj update on POST.
exports.caseobj_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: caseobj update POST');
};