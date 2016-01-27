var mongoose = require('mongoose')
, Schema = mongoose.Schema

var commentSchema = mongoose.Schema({
    content : {type: String, default: null},
    created_at: { type: Date, default: Date.now },
    created_by : { type: Schema.Types.ObjectId, ref: 'User' },
    last_updated_at: { type: Date, default: Date.now },
    last_updated_by : { type: Schema.Types.ObjectId, ref: 'User' },
    is_active: { type: Number, default: 1 },
    blog : { type: Schema.Types.ObjectId, ref: 'Blog' },
});

module.exports = mongoose.model('Comment', commentSchema);