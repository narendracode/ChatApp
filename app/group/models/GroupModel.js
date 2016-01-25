var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var groupSchema = mongoose.Schema({
    description : {type: String, default: null},
    name : {type: String, default: null},
    created_at : { type: Date, default: Date.now },
    last_updated_at: { type: Date, default: Date.now },
    group_type : { type:String, default:'public'},
    members : [{ type: Schema.Types.ObjectId, ref: 'User'}],
    created_by : { type: Schema.Types.ObjectId, ref: 'User' },
    is_active : { type: Number, default: 1 },
    url : { type: String, default:null}
});

module.exports = mongoose.model('Group', groupSchema);