const mongoose = require('mongoose');

// Define the Post schema with a reference to the User schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    photo: {
        type: String, // This will store the file path of the uploaded photo
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
 
 
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
