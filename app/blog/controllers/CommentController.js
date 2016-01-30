var mongoose = require('mongoose');
var Blog = require('../models/BlogModel');
var User = require('../../authorization/models/UserModel');
var ObjectId = mongoose.Types.ObjectId;
var winston = require('winston');
var config = require('../../../config/config.js');
var Comment = require('../models/CommentModel');


exports.create = function(req,res){
    var comment = new Comment();
    var blog_id = req.body.blog_id;
    comment.content = req.body.content;
    comment.last_updated_by =  new ObjectId(req.user._id);
    comment.created_by =  new ObjectId(req.user._id);
    comment.blog = new ObjectId(req.body.blog_id);
    console.log(" comment create is called : "+JSON.stringify(comment));
    
    comment.save(function(err,comment){
        if(err){
            res.json({'type':false,'msg':'Problem occurred while saving comment'});
        }
       
        Blog.findById(new ObjectId(blog_id),function(err,blog){
            if(err){
                res.json({'type':false,'msg':'Problem occurred while linking comment to blog'});
            }
            blog.comments.push(comment._id);
            blog.save(function(err,blogWithComment){
                if(err){
                    res.json({'type':false,'msg':'Problem occurred while updating blog'});
                }
                Comment.findById(comment._id).populate(
                    { path: 'created_by',
                      model: User, 
                      select: '_id local.name profilePic'
                    }).exec(function(err,result){
                    var data = result.toObject();
                    data.type = true;
                    console.log(" comment found : "+JSON.stringify(data));
                    res.json(data);
                });
                
            });
        });
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
    var id = new ObjectId(req.params.id); 
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
