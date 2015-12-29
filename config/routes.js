var index = require('../routes/index');
var auth = require('../routes/auth')
var chat = require('../routes/chat');
var blog = require('../routes/blog');

module.exports = function (app){
    app.use('/', index);
    app.use('/auth',auth);
    app.use('/chat',chat);
    app.use('/blog',blog);
}
