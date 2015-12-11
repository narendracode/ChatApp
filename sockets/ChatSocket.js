var User  = require('../app/authorization/models/UserModel.js');
var socketController  = require('../app/authorization/controllers/SocketController.js');

module.exports = function(io){
    'use strict';
    var chatNamespace = io.on("connection",function(socket){
        socket.on('disconnect',function(){
            socketController.delete(socket.id);
            setTimeout(function(){
            User.find({sockets: {$exists: true, $not: {$size: 0}}},function(err,result){
                if(err){
                    console.log(err);
                    //do nothing
                }
                    io.sockets.emit('user:updateList',result);
            });
            },2000);
        });

        socket.on('user:sendmsg',function(chatData){
            console.log("New message received :"+chatData);
            User.find({'local.email':chatData.senderEmail},function(err,data){
                var  senderSockets = data[0].toObject().sockets;
                var index = senderSockets.indexOf(socket.id);
                if(index>-1){
                    senderSockets.splice(index, 1);
                }
                
                User.find({'local.name' : chatData.receiver},function(err,data){
                    var receiverSockets = data[0].toObject().sockets;
                    receiverSockets =  receiverSockets.concat(senderSockets);
                    for(var i=0;i < receiverSockets.length; i++){
                        io.sockets.connected[receiverSockets[i]].emit('user:receivemsg',chatData);
                        
                    }
                }); 
            });
        });

        
        socket.on('user:typing',function(chatData){
            console.log(" $ user:typing event :"+chatData.status);
            User.find({'local.name' : chatData.receiver},function(err,data){
                var receiverSockets = data[0].toObject().sockets;
                for(var i=0;i < receiverSockets.length; i++){
                    io.sockets.connected[receiverSockets[i]].emit('user:typing',chatData);
                }
            }); 
        });
        
        socket.on('user:login',function(chatData){
            socketController.insert(socket.id, chatData.email);
            setTimeout(function(){
                User.find({sockets: {$exists: true, $not: {$size: 0}}},function(err,result){
                    if(err){
                        console.log(err);
                        //do nothing
                    }
                    io.sockets.emit('user:updateList',result);
                });
            },2000); 
        });
        
        socket.on('user:logout',function(chatData){
            socketController.delete(socket.id);
            setTimeout(function(){
                User.find({sockets: {$exists: true, $not: {$size: 0}}},function(err,result){
                    if(err){
                        console.log(err);
                        //do nothing
                    }
                    io.sockets.emit('user:updateList',result);
                });
            },2000);
        });
    });
}
