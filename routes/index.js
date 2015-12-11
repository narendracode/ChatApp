var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
 // res.render('index', { title: 'Express' });
    //res.json({message:"Welcome to index page"});
    res.redirect('/src/index.html');
});

module.exports = router;
