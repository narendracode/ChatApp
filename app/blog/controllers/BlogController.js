var mongoose = require('mongoose');
var Blog = require('../models/BlogModel');
var user = require('../../authorization/models/UserModel');
var socket = require('../../authorization/models/SocketModel');
var ObjectId = mongoose.Types.ObjectId;

exports.getBlogs = function(req,res){
    blog.find({},function(err,result){
        res.json(result);
    });
};

exports.get = function(req,res){
    //implement
    res.json({});
};

exports.create = function(req,res){
    var blog = new Blog();
    blog.content = req.body.body;
    blog.title = req.body.title;
    blog.status = req.body.status;
    blog.created_by.name = req.body.createdBy.name;
    blog.created_by.email = req.body.createdBy.email;
    
    blog.save(function(err,result){
        if(err){
            res.send(err);
        }
        res.json(result);
    });
};

exports.update = function(req,res){
    //implement
    res.json({});
};

exports.delete = function(req,res){
    //implement
    res.json({});
};