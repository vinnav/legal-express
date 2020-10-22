var Practicearea = require('../models/practicearea');
var Caseobj = require('../models/caseobj');
var Person = require('../models/person')
var async = require('async');
const { body,validationResult } = require("express-validator");

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
            Practicearea.findById(req.params.id)
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
exports.practicearea_create_get = function(req, res, next) {
    res.render('practicearea_form', {title: 'Create practice area'});
};

// Handle practicearea create on POST.
exports.practicearea_create_post =   [
   
    // Validate and sanitise the name field.
    body('name', 'Practice area name required').trim().isLength({ min: 1 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
          // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var practicearea = new Practicearea(
        { name: req.body.name }
        );

  
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('practicearea_form', { title: 'Create practice area', practicearea: practicearea, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Practicearea.findOne({ 'name': req.body.name })
                .exec( function(err, found_practicearea) {
                    if (err) { return next(err); }
                    if (found_practicearea) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(found_practicearea.url);
                    }
                    else {
                        practicearea.save(function (err) {
                            if (err) { return next(err); }
                            // Genre saved. Redirect to genre detail page.
                            res.redirect(practicearea.url);
                        });
                    }
                });
        }
    }
];

// Display practicearea delete form on GET.
exports.practicearea_delete_get = function(req, res) {
    async.parallel({
        practicearea: function(callback){
            Practicearea.findById(req.params.id).exec(callback)
        },
        practicearea_caseobj: function(callback){
            Caseobj.find({'practicearea':req.params.id}, 'name summary').exec(callback)
        },
    }, function(err, results){
            if(err){return next(err);}
            if(results.practicearea==null){ // No results.
                res.redirect('/manage/practiceareas')
            }
            //Successful, so render
            res.render('practicearea_delete', {title: 'Delete Practice Area', practicearea: results.practicearea, practicearea_caseobj: results.practicearea_caseobj});
    })
};

// Handle practicearea delete on POST.
exports.practicearea_delete_post = function(req, res) {
   
    async.parallel({
        practicearea: function(callback){
            Practicearea.findById(req.body.practiceareaid).exec(callback)
        },
        practicearea_caseobj: function(callback){
            Caseobj.find({'practicearea':req.body.practiceareaid}).exec(callback)
        },
        }, function(err,results){
            if(err){return next(err);}
            //Success
            if(results.practicearea_caseobj.length > 0) {
                //practicearea has cases. Render in some way as for GET route
                res.render('practicearea_delete', {title:'Delete practicearea', practicearea: results.practicearea, practicearea_caseobj: results.practicearea_caseobj});
                return;
            }
            else {
                // practicearea has no cases. Delete object and redirect to list of practiceareas.
                Practicearea.findByIdAndRemove(req.body.practiceareaid, function deletepracticearea(err){
                    if(err){return next(err);}
                    //Success, go to practicearea list
                    res.redirect('/manage/practiceareas')
                })
            }
    });
};

// Display practicearea update form on GET.
exports.practicearea_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: practice area update GET');
};

// Handle practicearea update on POST.
exports.practicearea_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: practice area update POST');
};