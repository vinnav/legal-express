var express = require('express');
var router = express.Router();

// Require controller modules.
var caseobj_controller = require('../controllers/caseobjController');
var person_controller = require('../controllers/personController');
var practicearea_controller = require('../controllers/practiceareaController');
var task_controller = require('../controllers/taskController');

/// CASEOBJ ROUTES ///

// GET catalog home page.
router.get('/', caseobj_controller.index);

// GET request for creating a caseobj. NOTE This must come before routes that display caseobj (uses id).
router.get('/caseobj/create', caseobj_controller.caseobj_create_get);

// POST request for creating caseobj.
router.post('/caseobj/create', caseobj_controller.caseobj_create_post);

// GET request to delete caseobj.
router.get('/caseobj/:id/delete', caseobj_controller.caseobj_delete_get);

// POST request to delete caseobj.
router.post('/caseobj/:id/delete', caseobj_controller.caseobj_delete_post);

// GET request to update caseobj.
router.get('/caseobj/:id/update', caseobj_controller.caseobj_update_get);

// POST request to update caseobj.
router.post('/caseobj/:id/update', caseobj_controller.caseobj_update_post);

// GET request for one caseobj.
router.get('/caseobj/:id', caseobj_controller.caseobj_detail);

// GET request for list of all caseobj items.
router.get('/casesobj', caseobj_controller.caseobj_list);

/// PERSON ROUTES ///

// GET request for creating person. NOTE This must come before route for id (i.e. display person).
router.get('/person/create', person_controller.person_create_get);

// POST request for creating person.
router.post('/person/create', person_controller.person_create_post);

// GET request to delete person.
router.get('/person/:id/delete', person_controller.person_delete_get);

// POST request to delete person.
router.post('/person/:id/delete', person_controller.person_delete_post);

// GET request to update person.
router.get('/person/:id/update', person_controller.person_update_get);

// POST request to update person.
router.post('/person/:id/update', person_controller.person_update_post);

// GET request for one person.
router.get('/person/:id', person_controller.person_detail);

// GET request for list of all persons.
router.get('/persons', person_controller.person_list);

/// PRACTICEAREA ROUTES ///

// GET request for creating a practicearea. NOTE This must come before route that displays practicearea (uses id).
router.get('/practicearea/create', practicearea_controller.practicearea_create_get);

//POST request for creating practicearea.
router.post('/practicearea/create', practicearea_controller.practicearea_create_post);

// GET request to delete practicearea.
router.get('/practicearea/:id/delete', practicearea_controller.practicearea_delete_get);

// POST request to delete practicearea.
router.post('/practicearea/:id/delete', practicearea_controller.practicearea_delete_post);

// GET request to update practicearea.
router.get('/practicearea/:id/update', practicearea_controller.practicearea_update_get);

// POST request to update practicearea.
router.post('/practicearea/:id/update', practicearea_controller.practicearea_update_post);

// GET request for one practicearea.
router.get('/practicearea/:id', practicearea_controller.practicearea_detail);

// GET request for list of all practicearea.
router.get('/practiceareas', practicearea_controller.practicearea_list);

/// TASK ROUTES ///

// GET request for creating a task. NOTE This must come before route that displays task (uses id).
router.get('/task/create', task_controller.task_create_get);

// POST request for creating task. 
router.post('/task/create', task_controller.task_create_post);

// GET request to delete task.
router.get('/task/:id/delete', task_controller.task_delete_get);

// POST request to delete task.
router.post('/task/:id/delete', task_controller.task_delete_post);

// GET request to update task.
router.get('/task/:id/update', task_controller.task_update_get);

// POST request to update task.
router.post('/task/:id/update', task_controller.task_update_post);

// GET request for one task.
router.get('/task/:id', task_controller.task_detail);

// GET request for list of all task.
router.get('/tasks', task_controller.task_list);

module.exports = router;