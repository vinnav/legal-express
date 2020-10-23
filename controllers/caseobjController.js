var Caseobj = require('../models/caseobj');
var Person = require('../models/person');
var Practicearea = require('../models/practicearea');
var Task = require('../models/task');
var async = require('async');
const { body,validationResult } = require('express-validator');

exports.index = function(req, res) {
    async.parallel({
        caseobj_count: function(callback) {
            Caseobj.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        task_count: function(callback) {
            Task.countDocuments({}, callback);
        },
        task_todo_count: function(callback) {
            Task.countDocuments({status:'To do'}, callback);
        },
        person_count: function(callback) {
            Person.countDocuments({}, callback);
        },
        practicearea_count: function(callback) {
            Practicearea.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Legal Express', error: err, data: results });
    });
};

// Display list of all caseobjs.
exports.caseobj_list = function(req, res, next) {

    Caseobj.find({}, 'name client')
        .populate('client')
        .exec(function (err, list_casesobj){
            if(err){return next(err);}
            //Successful, so render
            res.render('caseobj_list', {title: 'Case List', caseobj_list: list_casesobj});
        });
};

// Display detail page for a specific caseobj.
exports.caseobj_detail = function(req, res) {
    async.parallel({
        caseobj: function(callback) {
            Caseobj.findById(req.params.id)
                .populate('client')
                .populate('practicearea')
                .populate('claimant')
                .populate('defendant')
                .populate('lawyer')
                .exec(callback)
        },

        caseobj_task: function(callback){
            Task.find({'caseobj': req.params.id})
            .exec(callback);
        },
    }, function(err,results){
        if(err){return next(err)}
        if(results.caseobj==null){//No results.
            var err = new Error('Case not found');
            err.status = 404;
            return next(err);
        }
        //Successful, so render
        res.render('caseobj_detail', {title:'Case Detail', caseobj: results.caseobj, caseobj_task: results.caseobj_task});
    });
};

// Display caseobj create form on GET.
exports.caseobj_create_get = function(req, res, next) {
    // Get all person and practice area, for adding to cases
    async.parallel({
        persons: function(callback){
            Person.find(callback);
        },
        practiceareas: function(callback){
            Practicearea.find(callback);
        },
    }, function(err,results){
        if(err){return next(err);}
        res.render('caseobj_form', {title: 'Create Case', persons: results.persons, practiceareas: results.practiceareas});
    });
};

// Handle caseobj create on POST.
exports.caseobj_create_post = [
    //Validate and sanitise fields
    body('name', 'Name must not be empty').trim().isLength({min:1}).escape(),
    body('client', 'Client must not be empty').trim().isLength({min:1}).escape(),
    body('practicearea', 'Practice area must not be empty').trim().isLength({min:1}).escape(),
    body('jurisdiction', 'Jurisdiction must not be empty').trim().isLength({min:1}).escape(),
    body('status', 'Status must not be empty').trim().isLength({min:1}).escape(),
    
    //Process request after validation and sanitization
    (req, res, next) => {

        //Extract the validation errors from a request
        const errors = validationResult(req);

        //Create a caseobj with escaped and trimmed data.
        var caseobj = new Caseobj({
            name: req.body.name,
            client: req.body.client,
            practicearea: req.body.practicearea,
            jurisdiction: req.body.jurisdiction,
            status: req.body.status,
            claimant: req.body.claimant,
            defendant: req.body.defendant,
            lawyer: req.body.lawyer,
            summary: req.body.summary
            });
        if(!errors.isEmpty()){
            //There are errors. Render form again with sanitised values/error messages.

            //Get all the person and practicearea for form.
            async.parallel({
                persons: function(callback){
                    Person.find(callback);
                },
                practiceareas: function(callback){
                    Practicearea.find(callback)
                },
            }, function(err, results){
                if(err){return next(err);}
                res.render('caseobj_form', {title: 'Create Case', persons: results.persons, practiceareas: results.practiceareas, caseobj: caseobj, errors: errors.array()});
            });
            return
        }
        else {
            //Data from form is valid. Save case.
            caseobj.save(function(err){
                if(err){return next(err);}
                //Successful - redirect to new caseobj record
                res.redirect(caseobj.url);
            });
        }
    },
];

// Display caseobj delete form on GET.
exports.caseobj_delete_get = function(req, res, next) {
    async.parallel({
        caseobj: function(callback){
            Caseobj.findById(req.params.id).exec(callback)
        },
        caseobj_task: function(callback){
            Task.find({'caseobj':req.params.id}).exec(callback)
        },
    }, function(err, results){
            if(err){return next(err);}
            if(results.caseobj==null){ // No results.
                res.redirect('/manage/casesobj')
            }
            //Successful, so render
            res.render('caseobj_delete', {title: 'Delete Case', caseobj: results.caseobj, caseobj_task: results.caseobj_task});
    })
};

// Handle caseobj delete on POST.
exports.caseobj_delete_post = function(req, res, next) {
    async.parallel({
        caseobj: function(callback){
            Caseobj.findById(req.body.caseobjid).exec(callback)
        },
        caseobj_task: function(callback){
            Task.find({'caseobj':req.body.caseobjid}).exec(callback)
        },
        }, function(err,results){
            if(err){return next(err);}
            //Success
            if(results.caseobj_task.length > 0) {
                //Caseobj has tasks. Render in some way as for GET route
                res.render('caseobj_delete', {title:'Delete Case', caseobj: results.caseobj, caseobj_task: results.caseobj_task});
                return;
            }
            else {
                // caseobj has no cases. Delete object and redirect to list of caseobjs.
                Caseobj.findByIdAndRemove(req.body.caseobjid, function deleteCaseobj(err){
                    if(err){return next(err);}
                    //Success, go to caseobj list
                    res.redirect('/manage/casesobj')
                })
            }
    });
};

// Display caseobj update form on GET.
exports.caseobj_update_get = function(req, res, next) {
    // Get book, authors and genres for form.
    async.parallel({
        caseobj: function(callback) {
            Caseobj.findById(req.params.id).populate('client').populate('practicearea').populate('claimant')
            .populate('defendant').populate('lawyer').exec(callback);
        },
        persons: function(callback){
            Person.find(callback);
        },
        practiceareas: function(callback){
            Practicearea.find(callback);
        },
    }, function(err,results){
        if(err){return next(err);}
        if (results.caseobj==null) { // No results.
                var err = new Error('Case not found');
                err.status = 404;
                return next(err);}
        // Success.
        res.render('caseobj_form', {title: 'Create Case', persons: results.persons, practiceareas: results.practiceareas, caseobj: results.caseobj});
        });
};

// Handle caseobj update on POST.
exports.caseobj_update_post = [
    //Validate and sanitise fields
    body('name', 'Name must not be empty').trim().isLength({min:1}).escape(),
    body('client', 'Client must not be empty').trim().isLength({min:1}).escape(),
    body('practicearea', 'Practice area must not be empty').trim().isLength({min:1}).escape(),
    body('jurisdiction', 'Jurisdiction must not be empty').trim().isLength({min:1}).escape(),
    body('status', 'Status must not be empty').trim().isLength({min:1}).escape(),
    
    //Process request after validation and sanitization
    (req, res, next) => {

        //Extract the validation errors from a request
        const errors = validationResult(req);

        //Create a caseobj with escaped and trimmed data.
        var caseobj = new Caseobj({
            name: req.body.name,
            client: req.body.client,
            practicearea: req.body.practicearea,
            jurisdiction: req.body.jurisdiction,
            status: req.body.status,
            claimant: req.body.claimant,
            defendant: req.body.defendant,
            lawyer: req.body.lawyer,
            summary: req.body.summary,
            _id:req.params.id
            });
        if(!errors.isEmpty()){
            //There are errors. Render form again with sanitised values/error messages.

            //Get all the person and practicearea for form.
            async.parallel({
                persons: function(callback){
                    Person.find(callback);
                },
                practiceareas: function(callback){
                    Practicearea.find(callback)
                },
            }, function(err, results){
                if(err){return next(err);}
                res.render('caseobj_form', {title: 'Create Case', persons: results.persons, practiceareas: results.practiceareas, caseobj: caseobj, errors: errors.array()});
            });
            return
        }
        else {
            //Data from form is valid. Save case.
            Caseobj.findByIdAndUpdate(req.params.id, caseobj, {}, function(err, thecaseobj){
                if(err){return next(err);}
                //Successful - redirect to new caseobj record
                res.redirect(thecaseobj.url);
            });
        }
    },
];