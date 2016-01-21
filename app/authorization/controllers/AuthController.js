var passport = require('passport');
var User  = require('../models/UserModel.js');


exports.localSignup =   function(req, res, next){    
    passport.authenticate('local-signup',function(err, user, info){
        if (err) { 
            return res.json({type:false,data: 'error occured '+ err}); 
        }
            return res.json(user);
    })(req, res, next);
}


exports.deleteLocalUser = function(req,res,next){
    console.log(" in delete user  email : "+req.body.email);
    User.remove({"local.email" : req.body.email},function(err){
        if(err)
            res.json({type:false,data: 'error occured '+ err});

        res.json({type:true,data: 'user deleted successfully with email '+ req.body.email});
    });
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
