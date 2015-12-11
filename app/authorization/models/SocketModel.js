var mongoose = require('mongoose');
var socketSchema = mongoose.Schema({
    sockedId : String,
    email : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Socket', socketSchema);