var express = require('express');
var multer = require('multer');
var router = express.Router();
var blogController = require('../app/blog/controllers/BlogController');

var upload = multer({
    dest: './uploads/'
})


router.post('/',blogController.create); //create new blog

router.get('/',blogController.getBlogs); //return all published blogs by everyone
router.get('/drafts',blogController.getAllDraftBlogs); // return all draft blogs by logged in user.
router.get('/published',blogController.getAllPublished); //return all published blogs by logged in user.

//router.get('/:id',blogController.get);  //return single blog by id

router.get('/:url',blogController.getByUrl);

router.put('/:id',blogController.update); //update existing blog

router.delete('/:id',blogController.delete); //deelte existing blog

router.post('/upload',blogController.uploadImg);

module.exports = router;