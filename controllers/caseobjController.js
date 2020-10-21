var Caseobj = require('../models/caseobj');
var Person = require('../models/person');
var Practicearea = require('../models/practicearea');
var Task = require('../models/task');

var async = require('async');

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