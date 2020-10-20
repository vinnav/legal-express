#! /usr/bin/env node

console.log('This script populates some cases, persons, tasks, practice areas to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Caseobj = require('./models/caseobj')
var Person = require('./models/person')
var Practicearea = require('./models/practicearea')
var Task = require('./models/task')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var persons = []
var practiceareas = []
var casesobj = []
var tasks = []

function personCreate(first_name, last_name, contact_phone, contact_mail, cb) {
  persondetail = {first_name:first_name , last_name: last_name }
  if (contact_phone != false) persondetail.contact_phone = contact_phone
  if (contact_mail != false) persondetail.contact_mail = contact_mail
  
  var person = new Person(persondetail);
       
  person.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Person: ' + person);
    persons.push(person)
    cb(null, person)
  }  );
}
// TO DO
function practiceareaCreate(name, cb) {
  var practicearea = new Practicearea({ name: name });
       
  practicearea.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Practice Area: ' + practicearea);
    practiceareas.push(practicearea)
    cb(null, practicearea);
  }   );
}

function caseobjCreate(name, client, practicearea, jurisdiction, status, claimant, defendant, lawyer, summary, task, cb) {
  caseobjdetail = { 
    name: name,
    client: client,
    practicearea: practicearea,
    jurisdiction: jurisdiction,
    status: status,
  }
  if (claimant != false) caseobjdetail.claimant = claimant
  if (defendant != false) caseobjdetail.defendant = defendant
  if (lawyer != false) caseobjdetail.lawyer = lawyer
  if (summary != false) caseobjdetail.summary = summary
  if (task != false) caseobjdetail.task = task

  var caseobj = new Caseobj(caseobjdetail);
  caseobj.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Case: ' + caseobj);
    casesobj.push(caseobj)
    cb(null, caseobj)
  }  );
}


function taskCreate(caseobj, description, status, due, cb) {
  taskdetail = { 
    caseobj: caseobj,
    description: description,
    status: status,
  }    
  if (due != false) taskdetail.due = due

  var task = new Task(taskdetail);    
  task.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Task: ' + task);
      cb(err, null)
      return
    }
    console.log('New Task: ' + task);
    tasks.push(task)
    cb(null, task)
  }  );
}

function createPracticePersons(cb) {
    async.series([
        function(callback) {
          personCreate('Patrick', 'Douglas', '(555)354-5884', 'patrick.douglas@loblaw.com', callback);
        },
        function(callback) {
          personCreate('John', 'Stewart', '(555)354-5114', 'john.stewart@loblex.com', callback);
        },
        function(callback) {
          personCreate('Boris', 'Bonan', '', 'bbonan@gallaw.com', callback);
        },
        function(callback) {
          personCreate('Rob', 'Robertson', '', 'rrobert@rob.com', callback);
        },
        function(callback) {
          practiceareaCreate("Family", callback);
        },
        function(callback) {
          practiceareaCreate("Company", callback);
        },
        function(callback) {
          practiceareaCreate("IP", callback);
        },
        function(callback) {
          practiceareaCreate("European", callback);
        }
        ],
        // optional callback
        cb);
}


function createCasesobj(cb) {
    async.parallel([
        function(callback) {
          caseobjCreate('C-1143', persons[0], practiceareas[0], "London", "Ongoing", persons[1], persons[2], persons[3], "The claimant wants to challenge the will of his grandfather.", tasks[0], callback);
        }],
        // optional callback
        cb);
}

function createTasks(cb) {
    async.parallel([
        function(callback) {
          taskCreate(casesobj[0], 'Call the claimant to check info on death circumstances', 'To do', 2020-12-11, callback)
        }],
        // Optional callback
        cb);
}



async.series([
    createPracticePersons,
    createCasesobj,
    createTasks
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Tasks: '+ tasks);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
