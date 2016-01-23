var mongoose = require('mongoose');

var blogUrlSchema = mongoose.Schema({
    url : {type: String, default: null},
    created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('BlogUrl', blogUrlSchema);