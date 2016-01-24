var express = require('express');
var multer = require('multer');
var router = express.Router();
var groupController = require('../app/group/controllers/GroupController');


router.post('/',groupController.create); //create new Group

router.get('/id/:id',groupController.getById); 

router.get('/url/:url',groupController.getByUrl); 

router.get('/',groupController.getAllByCallingUser);

router.put('/:id',groupController.update); 

router.delete('/:id',groupController.delete); 

module.exports = router;