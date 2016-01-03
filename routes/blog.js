var express = require('express');
var multer = require('multer');
var router = express.Router();
var blogController = require('../app/blog/controllers/BlogController');

var upload = multer({
    dest: './uploads/'
})


router.post('/',blogController.create); //create new blog

router.get('/',blogController.getBlogs); //return all blogs

router.get('/:id',blogController.get);  //return single blog by id

router.put('/:id',blogController.update); //update existing blog

router.delete('/:id',blogController.delete); //deelte existing blog

//router.post('/upload',blogController.upload); //file upload

//router.post('/upload',blogController.uploadImage); //file upload

router.post('/upload',blogController.uploadImg);

module.exports = router;