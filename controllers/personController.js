var Person = require('../models/person');
var async = require('async');
var Caseobj = require('../models/caseobj');
const { body,validationResult } = require("express-validator");


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
exports.person_create_get = function(req, res, next) {
    res.render('person_form', {title: 'Create Person'});
};

// Handle person create on POST.
exports.person_create_post = [
    body('first_name').trim().isLength({min:1}).escape().withMessage('First name must be specified')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').trim().isLength({min:1}).escape().withMessage('Last name must be specified')
    .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('contact_phone', 'Invalid phone number').optional({ checkFalsy: true }).trim(),
    body('contact_mail', 'Invalid email').optional({ checkFalsy: true }).trim().isEmail(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        
        //Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('person_form', { title: 'Create Person', person: req.body, errors: errors.array() });
            return
        }
        else{
            //Data from form is valid.
            
            //Create a person object with escaped and trimmed data
            var person = new Person(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    contact_phone:req.body.contact_phone,
                    contact_mail:req.body.contact_mail,
                });
            person.save(function(err){
                if(err){return next(err);}
                //Successful - redirect to new person record.
                res.redirect(person.url)
            })
        }
    }
];



// Display person delete form on GET.
exports.person_delete_get = function(req, res, next) {
    async.parallel({
        person: function(callback){
            Person.findById(req.params.id).exec(callback)
        },
        person_caseobj: function(callback){
            Caseobj.find({$or:[{'client':req.params.id},{'lawyer':req.params.id},{'claimant':req.params.id},{'defendant':req.params.id}]}, 'name summary').exec(callback)
        },
    }, function(err, results){
            if(err){return next(err);}
            if(results.person==null){ // No results.
                res.redirect('/manage/persons')
            }
            //Successful, so render
            res.render('person_delete', {title: 'Delete Person', person: results.person, person_caseobj: results.person_caseobj});
    })
};

// Handle person delete on POST.
exports.person_delete_post = function(req, res, next) {
    
    async.parallel({
        person: function(callback){
            Person.findById(req.body.personid).exec(callback)
        },
        person_caseobj: function(callback){
            Caseobj.find({$or:[{'client':req.body.personid},{'lawyer':req.body.personid},{'claimant':req.body.personid},{'defendant':req.body.personid}]}).exec(callback)
        },
        }, function(err,results){
            if(err){return next(err);}
            //Success
            if(results.person_caseobj.length > 0) {
                //Person has cases. Render in some way as for GET route
                res.render('person_delete', {title:'Delete Person', person: results.person, person_caseobj: results.person_caseobj});
                return;
            }
            else {
                // Person has no cases. Delete object and redirect to list of persons.
                Person.findByIdAndRemove(req.body.personid, function deletePerson(err){
                    if(err){return next(err);}
                    //Success, go to person list
                    res.redirect('/manage/persons')
                })
            }
    });
};

// Display person update form on GET.
exports.person_update_get = function(req, res) {
    Person.findById(req.params.id)
    .exec(function(err, person){
        if(err){return next(err);}
        res.render('person_form', {title: 'Update Person', person: person});
    })
};

// Handle person update on POST.
exports.person_update_post = [
    body('first_name').trim().isLength({min:1}).escape().withMessage('First name must be specified')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').trim().isLength({min:1}).escape().withMessage('Last name must be specified')
    .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('contact_phone', 'Invalid phone number').optional({ checkFalsy: true }).trim(),
    body('contact_mail', 'Invalid email').optional({ checkFalsy: true }).trim().isEmail(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        
        //Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('person_form', { title: 'Update Person', person: req.body, errors: errors.array() });
            return
        }
        else{
            //Data from form is valid.
            
            //Update person object with escaped and trimmed data
            var person = new Person(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    contact_phone:req.body.contact_phone,
                    contact_mail:req.body.contact_mail,
                    _id: req.params.id
                });
            Person.findByIdAndUpdate(req.params.id, person, {}, function(err, theperson){
                if(err){return next(err);}
                //Successful - redirect to updated person record.
                res.redirect(theperson.url)
            })
        }
    }
];