var Person = require('../models/person');
var async = require('async');
var Caseobj = require('../models/caseobj');
const person = require('../models/person');

// Display list of all persons.
exports.person_list = function(req, res, next) {
    Person.find()
        .sort([['last_name', 'ascending']])
        .exec(function(err, list_persons){
            if(err){return next(err);}
            //Successful, so render
            res.render('person_list', {title: 'Persons', person_list: list_persons});
        });
};

// Display detail page for a specific person.
exports.person_detail = function(req, res) {
    async.parallel({
        person: function(callback) {
            Person.findById(req.params.id)
                .exec(callback)
        },
        person_caseobj: function(callback){
            Caseobj.find({$or:[{'client':req.params.id},{'lawyer':req.params.id},{'claimant':req.params.id},{'defendant':req.params.id}]}, 'name summary')
            .exec(callback)
        },
    }, function(err, results){
        if(err){return next(err);}
        if(results.person==null){
            var err = new Error('Person not found');
            err.status = 404;
            return next(err);
        }
        //Successful, so render
        res.render('person_detail',{title: 'Person Detail', person: results.person, person_caseobj: results.person_caseobj});
    });
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