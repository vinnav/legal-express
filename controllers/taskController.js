var Task = require('../models/task');
var Caseobj = require('../models/caseobj');
const {body,validationResult} = require('express-validator');
var async = require('async')

// Display list of all tasks.
exports.task_list = function(req, res, next) {
    Task.find()
        .populate('caseobj')
        .exec(function(err, list_tasks){
            if(err){return next(err);}
            //Successful, so render
            res.render('task_list', {title: 'Tasks', task_list: list_tasks})
        })
};

// Display detail page for a specific task.
exports.task_detail = function(req, res, next) {

    Task.findById(req.params.id)
    .populate('caseobj')
    .exec(function (err, task) {
      if (err) { return next(err); }
      if (task==null) { // No results.
          var err = new Error('Task not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('task_detail', { title: 'Task: ', task: task});
    })
};

// Display task create form on GET.
exports.task_create_get = function(req, res, next) {
    Caseobj.find({},'name client')
    .populate('client')
    .exec(function (err, caseobjs) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('task_form', {title: 'Create Task', caseobj_list: caseobjs});
    });    
};

// Handle task create on POST.
exports.task_create_post = [

    // Validate and sanitise fields.
    body('description', 'Description must be specified').trim().isLength({ min: 1 }).escape(),
    body('due', 'Invalid date').isISO8601().toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var task = new Task(
          { caseobj: req.body.caseobj,
            description: req.body.description,
            status: req.body.status,
            due: req.body.due
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Task.find({},'description')
                .exec(function (err, caseobj) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('task_form', { title: 'Create Task', caseobj_list: caseobj, selected_caseobj: task.caseobj._id , errors: errors.array(), task: task });
            });
            return;
        }
        else {
            // Data from form is valid.
            task.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(task.url);
                });
        }
    }
];

// Display task delete form on GET.
exports.task_delete_get = function(req, res, next) {    
    Task.findById(req.params.id)
    .populate('caseobj')
    .exec(function (err, task) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('task_delete', { title: 'Delete Task: ', task: task});
    });
}

// Handle task delete on POST.
exports.task_delete_post = function(req, res, next) {
    Task.findById(req.body.taskid)
    .exec(function (err, task) {
        if (err) { return next(err); }
        // Delete object and redirect to page.
        Task.findByIdAndRemove(req.body.taskid, function deleteTask(err){
        if(err){return next(err);}
        //Success, go to person list
        res.redirect('/manage/tasks')
        })
        });
};

// Display task update form on GET.
exports.task_update_get = function(req, res, next) {

    async.parallel({
        tasks: function(callback){
            Task.findById(req.params.id)
            .exec(callback);
        },
        caseobj_list: function(callback){
            Caseobj.find({},'name client')
            .populate('client')
            .exec(callback);
        },
    }, function(err,results){
        if(err){return next(err);}
        res.render('task_form', {title: 'Update Task', task: results.tasks, caseobj_list: results.caseobj_list});
    });
};

// Handle task update on POST.
exports.task_update_post = [

    // Validate and sanitise fields.
    body('description', 'Description must be specified').trim().isLength({ min: 1 }).escape(),
    body('due', 'Invalid date').isISO8601().toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var task = new Task(
          { caseobj: req.body.caseobj,
            description: req.body.description,
            status: req.body.status,
            due: req.body.due,
            _id: req.params.id
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            async.parallel({
                tasks: function(callback){
                    Task.findById(req.params.id)
                    .exec(callback);
                },
                caseobj_list: function(callback){
                    Caseobj.find({},'name client')
                    .populate('client')
                    .exec(callback);
                },function(err,results){
                    if(err){return next(err);}
                    // Successful, so render.
                    res.render('task_form', { title: 'Create Task', caseobj_list: caseobj, selected_caseobj: task.caseobj._id , errors: errors.array(), task: task });
            }});
                return
            }
            else {
            // Data from form is valid.
            Task.findByIdAndUpdate(req.params.id, task, {}, function (err, thetask) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(thetask.url);
                });
        }
    }
];