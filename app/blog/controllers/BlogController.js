var mongoose = require('mongoose');
var Blog = require('../models/BlogModel');
var user = require('../../authorization/models/UserModel');
var socket = require('../../authorization/models/SocketModel');
var ObjectId = mongoose.Types.ObjectId;

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
