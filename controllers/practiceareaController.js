var Practicearea = require('../models/practicearea');
var Caseobj = require('../models/caseobj');
var Person = require('../models/person')
var async = require('async');
const practicearea = require('../models/practicearea');

// Display list of all practicearea.
exports.practicearea_list = function(req, res, next) {
    Practicearea.find()
        .sort([['name', 'ascending']])
        .exec(function(err, list_practiceareas){
            if(err){return next(err);}
            //Successful, so render
            res.render('practicearea_list',{title:'Practice Area', practicearea_list: list_practiceareas})
        })
};

// Display detail page for a specific practicearea.
exports.practicearea_detail = function(req, res, next) {
    async.parallel({
        practicearea: function(callback) {
            practicearea.findById(req.params.id)
                .exec(callback)
        },

        practicearea_caseobj: function(callback){
            Caseobj.find({'practicearea': req.params.id})
            .exec(callback);
        },
        
        practicearea_person: function(callback){
            Person.find()
            .exec(callback);
        },
    }, function(err,results){
        if(err){return next(err)}
        if(results.practicearea==null){//No results.
            var err = new Error('Practice area not found');
            err.status = 404;
            return next(err);
        }
        //Successful, so render
        res.render('practicearea_detail', {title:'Practice Area Detail', practicearea: results.practicearea, practicearea_caseobj: results.practicearea_caseobj, practicearea_person: results.practicearea_person});
    });
};

// Display practicearea create form on GET.
exports.practicearea_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: practice area create GET');
};

// Handle practicearea create on POST.
exports.practicearea_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: practice area create POST');
};

// Display practicearea delete form on GET.
exports.practicearea_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: practice area delete GET');
};

// Handle practicearea delete on POST.
exports.practicearea_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: practice area delete POST');
};

// Display practicearea update form on GET.
exports.practicearea_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: practice area update GET');
};

// Handle practicearea update on POST.
exports.practicearea_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: practice area update POST');
};