const mongoose = require('mongoose');

// Define the Post schema with a reference to the User schema
const postSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       
    }
});
 
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
