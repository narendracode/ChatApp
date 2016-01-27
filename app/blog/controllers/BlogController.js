var mongoose = require('mongoose');
var Blog = require('../models/BlogModel');
var user = require('../../authorization/models/UserModel');
var socket = require('../../authorization/models/SocketModel');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');
var multer = require('multer');
var winston = require('winston');
var config = require('../../../config/config.js');
var gm = require('gm');
var BlogUrl = require('../models/BlogUrlModel');
var getSlug = require('speakingurl');

var slug = function(title){
    return getSlug(title);
}

    var formatURL = function(cnt,url){
          var len = cnt.toString().length;
          if(cnt == 0)
             return url;
          if(len == 1){
              return  url.substring(0,url.length - cnt.toString().length + 2) + cnt;
          }else
              return url.substring(0,(url.length) - (cnt.toString().length - 1)) + cnt;
  };

var generateUrl = function(url,callback){
    var blogUrl = new BlogUrl();
    var urlFound;
    var count=0;
    (function loop() {
        checkUrl(url,function(result){
            if(Number(result) > 0){
                count++;
                url = formatURL(count,url);
                loop();
            }else{
            blogUrl.url = url;
            blogUrl.save(function(err,result){
                console.log(" new Blog URL Created : "+JSON.stringify(result));
            });
                callback(url);
            }
        })
    }());
}

var checkUrl = function(url,callback){
    return BlogUrl.count({'url':url},function(err, count){
        callback(count);
    });
}

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
var upload = multer({ dest : config.upload}).single('userPhoto');


exports.uploadImg = function(req,res){
    console.log(" File log : "+req.files.file.name+"    ,path: "+req.files.file.path);
    winston.log('info', " File log : "+req.files.file.name+"    ,path: "+req.files.file.path);
    var s = req.files.file.path.split("/");    
    // get the temporary location of the file
    var tmp_path = req.files.file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
//    var target_path = '/Users/narendra/Documents/workspace/NodeJsWorkspace/ChatApp/uploads/' + s[s.length - 1];
   
    var target_path = './uploads/' + s[s.length - 1];
    
    //check file size
    
   /* 
   install imagemagick
   gm('/Users/narendra/Desktop/image.jpg')
        .size(function (err, size) {
        if (!err){
            winston.log(" error occured : "+err);
            console.log(size.width > size.height ? 'wider' : 'taller than you');
        }
        winston.log('info'," file height : "+size.height+" ,file  width : "+size.width);
    });
    */
    winston.log('info','checkpoint');
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
 Blog.find({'status':'Published'}).sort({'last_updated_at':-1}).exec(function(err,result){
        if(err){
            res.send(err);
        }
        res.json(result);
    });
};


exports.getAllDraftBlogs = function(req,res){
 Blog.find({'created_by.email':req.user.email,'status':'Draft'}).sort({'last_updated_at':-1}).exec(function(err,result){
        if(err){
            res.send(err);
        }
        res.json(result);
    });
};

exports.getAllPublished = function(req,res){
 Blog.find({'created_by.email':req.user.email,'status':'Published'}).sort({'last_updated_at':-1}).exec(function(err,result){
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

exports.getByUrl = function(req,res){
   /* Blog.findOne({url: req.params.url}).populate('comments').exec(function (err, result){
        if(err){
            res.send(err);
        }
        res.json(result);
    }); 
    */
    
    Blog.findOne({url: req.params.url}).populate({
            path : 'comments',
        populate : { path: 'created_by', model: user, 
                    select: '_id local.name profilePic' }
        }
    ).exec(function (err, result){
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

    blog.created_by.name = req.user.name;
    blog.created_by.email = req.user.email;
    
    generateUrl(slug(blog.title),function(url){
        blog.url = url;

    blog.save(function(err,result){
        if(err){
            res.json({'type':false,'msg':'Problem occurred while creating blogs'});
        }
        var data = result.toObject();
        data.type = true;
        winston.log(" Blog created : "+JSON.stringify(data));
        res.json(data);
    });
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
            blog.status = req.body.status;

            blog.created_by.name = req.user.name;
            blog.created_by.email = req.user.email;
        generateUrl(slug(blog.title),function(url){
            blog.url = url;
            blog.save(function(err,result){
                if(err){
                    res.json({'type':false,'msg':'Problem occurred while updating blog'});
                }
                var data = result.toObject();
                data.type = true;
                winston.log(" Blog updated : "+JSON.stringify(data));
                res.json(data);
            });
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
