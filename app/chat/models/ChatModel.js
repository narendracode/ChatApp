var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
    messages: [{
        message_type: { type: Number, default: 1},//text - 1, image - 2, video - 3, href - 4
        message : {type: String, default: null},
        image_url : {type: String, default: null},
        is_active: { type: Number, default: 1 },//active - 1, disabled - 0
        sent_by : String,
        sent_at : { type: Date, default: Date.now }
    }],
    created_at: { type: Date, default: Date.now },
    last_updated_at: { type: Date, default: Date.now },
    created_by : {type: String, default: null},
    is_active: { type: Number, default: 1 },
    // active : 1, disabled : 0
    participants : [{
        user_id: String,
        username: String
    }],
    chat_type: { type: Number, default: 0 }
    //personal - 0, group - 1
});

module.exports = mongoose.model('Chat', chatSchema);