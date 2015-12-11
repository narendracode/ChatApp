module.exports = function(io){
    'use strict';
    var chartNamespace = io.on("connection",function(socket){
        socket.on('user:updateChart',function(chartData){
            console.log("Chart data is updated"+chartData);
            io.sockets.emit('user:updateChart',chartData);
        });
    });
}