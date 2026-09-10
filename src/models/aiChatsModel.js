import mongoose from "mongoose";

const aiChatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

let aiChatsModel;
try {
    aiChatsModel = mongoose.model('Chats');
} catch (error) {
    aiChatsModel = mongoose.model('Chats', aiChatsSchema);
}

export default aiChatsModel;