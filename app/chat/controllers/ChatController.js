var mongoose = require('mongoose');
var chat = require('../models/ChatModel');
var user = require('../../authorization/models/UserModel');
var socket = require('../../authorization/models/SocketModel');
var ObjectId = mongoose.Types.ObjectId;

exports.getAllMembers = function(req,res){
    user.find({},function(err,result){
       if(err){
            res.send(err);   
       }
        //console.log("$$$ result from /chat/member/all  :"+result);
        res.json(result);
    });
};

exports.getOnlineMembers = function(req,res){
    user.find({sockets: {$exists: true, $not: {$size: 0}}},function(err,result){
        if(err){
            console.log(err);
            //do nothing
        }
       console.log("$$$$ result of online members : "+result);
        res.json(result);
    });
};

exports.send = function(req,res){
    var chatData = req.body;
    // save to DB  "message":"dfadsf","create_by":"narendra"
    //chat.messages.push({message:req.body.message, sentBy: req.body.create_by});
    
    
   // console.log(" ## send message : "+JSON.stringify(chatData));
    res.json(chatData);
};