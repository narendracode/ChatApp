var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var config = require('./config/config');
var mongoose = require("mongoose");
var passport = require('passport');
var multipart = require('connect-multiparty');
var FileStreamRotator = require('file-stream-rotator');
var moment = require('moment');
var jwt = require('express-jwt'); 

var winston = require('winston');

var app = express();

var logDirectory = __dirname + '/log'

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)



// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/log/access-'+moment().format('DD-MM-YYYY')+'.log', {flags: 'a'})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('combined', {stream: accessLogStream})) //writes to file in log directory

winston.add(
    winston.transports.File, 
    {
        filename: __dirname+'/log/main-'+moment().format('DD-MM-YYYY')+'.log',
        timestamp: function() {
            //return Date.now();
            return moment().format('DD-MM-YYYY hh:mm:ss');
        }
    }
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(multipart({
    uploadDir: config.tmp
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(express.static(path.join(__dirname, 'client/src')));

app.use('/vendor',express.static(path.join(__dirname, 'client/vendor')));
app.use('/src',express.static(path.join(__dirname, 'client/src')));
app.use('/app',express.static(path.join(__dirname, 'client/src/app')));
app.use('/common',express.static(path.join(__dirname, 'client/src/common')));
app.use('/assets',express.static(path.join(__dirname, 'client/src/assets')));
app.use('/files',express.static(path.join(__dirname,'uploads')));

var connect = function(){
    var options = {
        server: {
            socketOptions:{
                keepAlive : 1
            }
        }
    };
    winston.log('info', 'connected to mongo db with config url : '+config.db);
    mongoose.connect(config.db,options);
};
connect();
mongoose.connection.on('error',console.log);
mongoose.connection.on('disconnected',connect);
require('./app/authorization/passport')(passport); //settting up passport config

var cert = fs.readFileSync('key.pem');

app.use(jwt({ secret: cert}).unless({path: ['/auth/signup',
                                            '/auth/login',
                                            '/auth/userinfo',
                                            '/auth/logout'
                                           // ,'/blog'
                                           // ,'/blog/:id'
                                           ]})); // API end point in path are public 

app.use(function(err, req, res, next){
  
    if (err.constructor.name === 'UnauthorizedError') {
        console.log(" ##### Err "+err);
        //res.status(401).send('Unauthorized');
        res.json([{type:false,cause:"UNAUTHORIZED",msg:"You are not authorized to access this."}]);
    }
});


require('./config/routes')(app);
require('./config/express')(app);


module.exports = app;
