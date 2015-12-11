var mongoose = require('mongoose');
var Socket = require('../models/SocketModel');
var User = require('../models/UserModel');
var ObjectId = mongoose.Types.ObjectId;

exports.clean = function(){
    Socket.remove({},function(err,data){
        User.update({}, { sockets : []  }, {upsert : true}, function(err,result){
            console.log(".... clean sockets result : "+result);
        });
    });
};

exports.cleanSockets = function(){
    User.update({},{ $set : { sockets : [] } },{multi : true},function(err,result){
        console.log(".... clean sockets result : "+result);
    });
};

exports.insert = function(socketid, email){
    var socket = new Socket({sockedId : socketid , email : email});
    socket.save(function(err,result){
        if(err){
           // return{}
        }
       // return result;
        User.findOne({'local.email':email },function(err,user){
            if(err){
                //do nothing
            }
            if(user){
                user.sockets.push(socketid);
                user.save(function(err,user1){
                    if(err){
                        //do nothing
                    }
                    if(user1){
                       // console.log("user data after pushing socket : "+user1);
                    }
                });
            }
        });
    });
};

exports.delete = function(socketId){
    Socket.findOne({"sockedId" : socketId },function(err,socket){
        if(err){
            //do nothing
        }
        if(socket){
            User.findOne({'local.email': socket.email},function(err,user){
                if(err){//do nothing
                
                }
                if(user){
                    var index = user.sockets.indexOf(socketId);
                    if (index > -1) {
                        user.sockets.splice(index, 1);
                        user.save(function(err,user1){
                            if(err){
                                //do nothing
                            }
                            if(user1){
                               // console.log("user data after deleting socket : "+user1);
                            }
                        });
                    }
                }//
            });
            socket.remove({"_id":socket._id},function(err,result){
                return result ;
            });
        }
    }); 
};


