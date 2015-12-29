var mongoose = require('mongoose');
var blog = require('../models/BlogModel');
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
    //implement
    res.json({});
};

exports.update = function(req,res){
    //implement
    res.json({});
};

exports.delete = function(req,res){
    //implement
    res.json({});
};