const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const chatSchema = new Schema({
    senderId: {type: String, required: true},
    receiverId: {type: String, required: true},
    message: {type: String, required: true},
    timestamp: {type: Date, default: Date.now}
})


module.exports = mongoose.model('Chat', chatSchema); 