var mongoose = require('mongoose');
var Blog = require('../models/BlogModel');
var user = require('../../authorization/models/UserModel');
var socket = require('../../authorization/models/SocketModel');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');
var multer = require('multer');

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(" store destination is called file name :"+file.name+"   ,path : "+file.path);
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log(" store filename is called file name :"+file.name+"   ,path : "+file.path);
        callback(null, file.fieldname + '-' + Date.now());
    }
});
//var upload = multer({ storage : storage}).single('userPhoto');
var upload = multer({ dest : '/Users/narendra/Documents/workspace/NodeJsWorkspace/ChatApp/uploads'}).single('userPhoto');


exports.uploadImg = function(req,res){
    console.log(" File log : "+req.files.file.name+"    ,path: "+req.files.file.path);
    var s = req.files.file.path.split("/");    
    // get the temporary location of the file
    var tmp_path = req.files.file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
//    var target_path = '/Users/narendra/Documents/workspace/NodeJsWorkspace/ChatApp/uploads/' + s[s.length - 1];
   
    var target_path = './uploads/' + s[s.length - 1];
    
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) {
                res.json({result: false});
            }else{
                console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
                res.json({result : true, file : { name : s[s.length - 1]}});
            };
        });
    });
    
};

exports.getBlogs = function(req,res){
    Blog.find({},function(err,result){
        if(err){
            res.send(err);
        }
        res.json(result);
    });
};

exports.get = function(req,res){
    id = new ObjectId(req.params.id);
    Blog.findById({_id: id},function(err,result){
        if(err){
            res.send(err);
        }
        res.json(result);
    });
};

exports.create = function(req,res){
    var blog = new Blog();
    blog.content = req.body.content;
    blog.title = req.body.title;
    blog.status = req.body.status;
    blog.created_by.name = req.body.createdBy.name;
    blog.created_by.email = req.body.createdBy.email;
    
    console.log(JSON.stringify(blog));
    
    blog.save(function(err,result){
        if(err){
            res.send(err);
        }
        res.json(result);
    });
};

exports.update = function(req,res){
    var id = req.params.id;
    try{
        id = new ObjectId(id);
        Blog.findById(id,function(err,blog){
            if(err){
                res.send(err);
            }
            blog.title = req.body.title;
            blog.content = req.body.content;
            blog.save(function(err,result){  
                if(err)
                    res.send(err);
                res.json(result);
            });
        });
    }catch(e){
        res.send(404);
    }
};


exports.delete = function(req,res){
    var id = req.params.id;
    try{
        id = new ObjectId(id);
        Blog.remove({_id : id},function(err,result){
            if(err){
                res.send(err);
            }
            res.json(result);
        });
    }catch(e){
        res.send(404);
    }    
};
