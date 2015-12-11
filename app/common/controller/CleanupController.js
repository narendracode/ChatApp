var socketController  = require('../../authorization/controllers/SocketController.js');
var authController = require('../../authorization/controllers/AuthController.js');
exports.cleanup = function(){
    socketController.clean();
};