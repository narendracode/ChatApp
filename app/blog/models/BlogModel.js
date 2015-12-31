var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
    content : {type: String, default: null},
    title : {type: String, default: null},
    status : { type: String, default: 'Draft'},
    created_at: { type: Date, default: Date.now },
    last_updated_at: { type: Date, default: Date.now },
    created_by :{
        name: {type: String, default: null},
        email:  {type: String, default: null}
    },
    is_active: { type: Number, default: 1 }
});

module.exports = mongoose.model('Blog', blogSchema);