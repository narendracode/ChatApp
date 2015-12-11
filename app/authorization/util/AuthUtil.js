exports.ensureAuthorized = function(req, res, next) {
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
};
