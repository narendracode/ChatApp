var index = require('../routes/index');
var auth = require('../routes/auth')
var chat = require('../routes/chat');
var blog = require('../routes/blog');
var group = require('../routes/group');

module.exports = function (app){
    app.use('/', index);
    app.use('/auth',auth);
    app.use('/chat',chat);
    app.use('/blog',blog);
    app.use('/group',group);
}
