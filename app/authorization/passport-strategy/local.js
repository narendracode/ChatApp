var LocalStrategy   = require('passport-local').Strategy;
var User  = require('../models/UserModel.js');
var jwt        = require("jsonwebtoken");
var config = require('../../../config/config');
var fs = require('fs');
exports.signupStrategy = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            var name = req.body.name;
	    User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err){
		              return done(err);
		        }
                if (user) {
                    return done(null, {type : false,data: 'Email is already taken.'});
                } else {
                    var newUser  = new User();
                    newUser.role =  'user';
                    newUser.local.email = email;
                    newUser.local.name = name;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function(err,user) {
                        if (err){
                            return done(null,{
                                type:false,
                                data: 'error occured '+ err
                            });
                        }
                        var cert = fs.readFileSync('key.pem');
                        var token = jwt.sign({email: user.local.email, role : user.role, name : user.local.name}, cert, { algorithm: 'RS256'});
                        user.token = token;
                        user.save(function(err,user1){
                            if(err){
                                return done(null, { type : false,data: 'Error occured '+ err});
                            }
                            return done(null, {type : true, data: {email: user1.local.email, role : user1.role, name: user1.local.name}, token : user1.token});
                        }); 
                    });   
               }
            });    
        });
    }                                      
);

exports.loginStrategy = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            var mUser = new User();
            User.findOne({'local.email': email}, function(err, user) {
                if (err){
                    return done(null,{type:false,data: 'error occured '+ err});
                }
                if (!user) {
                     return done(null, {type: false, 'data': "Account doesn't exists with the email provided."});
                } 
                if(!user.validPassword(password)){
                    return done(null, {type: false, 'data': 'Password is wrong.'}); 
				}
                return done(null, {type : true, data: {email: user.local.email, role : user.role, name: user.local.name},token : user.token});
            });    
        });
    }                                      
);


