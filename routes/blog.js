var express = require('express');
var router = express.Router();
var blogController = require('../app/blog/controllers/BlogController');

router.post('/',blogController.create); //create new blog

router.get('/',blogController.getBlogs); //return all blogs

router.get('/:id',blogController.get);  //return single blog by id

router.put('/:id',blogController.get); //update existing blog

router.delete('/:id',blogController.delete); //deelte existing blog

module.exports = router;