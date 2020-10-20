var Task = require('../models/task');

// Display list of all tasks.
exports.task_list = function(req, res) {
    res.send('NOT IMPLEMENTED: task list');
};

// Display detail page for a specific task.
exports.task_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: task detail: ' + req.params.id);
};

// Display task create form on GET.
exports.task_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: task create GET');
};

// Handle task create on POST.
exports.task_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: task create POST');
};

// Display task delete form on GET.
exports.task_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: task delete GET');
};

// Handle task delete on POST.
exports.task_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: task delete POST');
};

// Display task update form on GET.
exports.task_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: task update GET');
};

// Handle task update on POST.
exports.task_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: task update POST');
};