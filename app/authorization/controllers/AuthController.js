var passport = require('passport');
var User  = require('../models/UserModel.js');

exports.cleanSockets = function(callback){
    User.update({},{ $set : { sockets : [] } },{multi : true},callback);
};

exports.facebookLogin = function(req,res,next){
	passport.authenticate('facebook-login',{scope:'email'})(req,res,next);
}

exports.facebookLoginCallback = function(req,res,next){
	passport.authenticate('facebook-login',
	{
		successRedirect:'/',
		failureRedirect:'/login'
	})(req,res,next);
}

exports.localSignup =   function(req, res, next){    
    passport.authenticate('local-signup',function(err, user, info){
        if (err) { 
            return res.json({type:false,data: 'error occured '+ err}); 
        }
            return res.json(user);
    })(req, res, next);
}

exports.localLogin = function(req, res, next){
    passport.authenticate('local-login',function(err, user, info){
        if (err) { 
            return res.json({type:false,data: 'error occured '+ err}); 
        }
        if(user){
            return res.json(user);
        }
    })(req, res, next);
}

exports.logout = function(req, res) {
  if(req.user) {
     req.session.destroy();
    req.logout();
    res.json({'status':200,'message':'User successfully logged out.','role':'none',type:false});
  } else {
      res.json({'status':200,'message':'User successfully logged out','role':'none', type: false});
  }
};


/**
 * Session
 * returns info on authenticated user
 */
exports.isUserAuthenticated = function(req,res){
    if(req.user){
         res.json({'message':true});
    }else{
        res.json({'message':false});
    }
}

exports.getCurentUserInfo = function(req, res) {
    if(req.user){
         res.json(req.user);
    }else{
        res.json({'status':404,'message':'no user found','role':'none'});
    }
};

exports.getLoggedInUserInfoByToken = function(req,res){
    var token = req.params.token;
     User.findOne({ 'token' :  token }, function(err, user) {
        if (err){
            res.json({type:false, data: "Error occured: "+ err});
        }
        else if(!(!!user)){
            res.json({'status':404,'message':'no user found','role':'none'});
        }
        else res.json(user);
     });
};
function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}