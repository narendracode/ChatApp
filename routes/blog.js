var express = require('express')
 ,multer = require('multer')
 ,router = express.Router()
 ,blogController = require('../app/blog/controllers/BlogController')
 ,commentController = require('../app/blog/controllers/CommentController')

var upload = multer({
    dest: './uploads/'
})


router.post('/',blogController.create); //create new blog

router.post('/comment',commentController.create); //create new blog

router.get('/',blogController.getBlogs); //return all published blogs by everyone
router.get('/comment',commentController.get); //get all comments by blog id

router.get('/drafts',blogController.getAllDraftBlogs); // return all draft blogs by logged in user.
router.get('/published',blogController.getAllPublished); //return all published blogs by logged in user.

//router.get('/:id',blogController.get);  //return single blog by id

router.get('/:url',blogController.getByUrl);

router.put('/:id',blogController.update); //update existing blog
router.put('/comment/:id',commentController.update); //update existing comment

router.delete('/:id',blogController.delete); //delete existing blog

router.delete('/comment/:id',commentController.delete); //delete existing comment

router.post('/upload',blogController.uploadImg);




module.exports = router;