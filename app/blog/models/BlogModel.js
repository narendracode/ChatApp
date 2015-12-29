var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
    content : {type: String, default: null},
    title : {type: String, default: null},
    created_at: { type: Date, default: Date.now },
    last_updated_at: { type: Date, default: Date.now },
    created_by : {type: String, default: null},
    is_active: { type: Number, default: 1 }
});

module.exports = mongoose.model('Blog', blogSchema);