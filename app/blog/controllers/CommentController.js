var mongoose = require('mongoose');
var Blog = require('../models/BlogModel');
var User = require('../../authorization/models/UserModel');
var ObjectId = mongoose.Types.ObjectId;
var winston = require('winston');
var config = require('../../../config/config.js');
var Comment = require('../models/CommentModel');


exports.create = function(req,res){
    var comment = new Comment();
    comment.content = req.body.content;
    comment.last_updated_by =  new ObjectId(req.user._id);
    comment.created_by =  new ObjectId(req.user._id);
    comment.save(function(err,result){
        if(err){
            res.json({'type':false,'msg':'Problem occurred while saving comment'});
        }
        var data = result.toObject();
        data.type = true;
        winston.log(" comment created : "+JSON.stringify(data));
        res.json(data);
    });
};

exports.get = function(req,res){
    //get all comments by blog id
    Comment.find({blog:new ObjectId(req.params.blog_id),is_active:1 },function(err,result){
        if(err){
            res.json({'type':false,'msg':'Problem occurred while finding comment'});
        }
        res.json(result);
    });
};

exports.update = function(req,res){
    //update a comment
    Comment.findById(id,function(err,comment){
        if(err){
            res.json({'type':false,'msg':'Problem occurred while finding comment'});
        }
        comment.content = req.body.content;
        comment.last_updated_by = new ObjectId(req.user._id);
        comment.last_updated_at = Date.now();
        
        comment.save(function(err,result){
            if(err){
                res.json({'type':false,'msg':'Problem occurred while finding comment'});
            }
            res.json(result);
        });
    });  
};

exports.delete = function(req,res){
    var id = new ObjectId(req.params.id);    
    Comment.findById(id,function(err,comment){
        if(err){
            res.json({'type':false,'msg':'Problem occurred while finding comment'});
        }
        comment.is_active = 0;
        comment.save(function(err,result){
            if(err){
                res.json({'type':false,'msg':'Problem occurred while finding comment'});
            }
            res.json(result);
        });
    });
    
};
