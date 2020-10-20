var Person = require('../models/person');

// Display list of all persons.
exports.person_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Person list');
};

// Display detail page for a specific person.
exports.person_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: person detail: ' + req.params.id);
};

// Display person create form on GET.
exports.person_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: person create GET');
};

// Handle person create on POST.
exports.person_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: person create POST');
};

// Display person delete form on GET.
exports.person_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: person delete GET');
};

// Handle person delete on POST.
exports.person_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: person delete POST');
};

// Display person update form on GET.
exports.person_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: person update GET');
};

// Handle person update on POST.
exports.person_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: person update POST');
};