const mongoose = require('mongoose');
const Conversation = require('./conversationModel').Conversation;

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Conversation',
        required: [true, 'a message must belong to a conversation']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

exports.Message = mongoose.model('Message', messageSchema);