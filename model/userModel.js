const mongoose = require('mongoose');

//   schema 
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
}, 
email:{
    type :String,
    required:true
},
password:{
    type: String,
    required:true
},

phone:{
    type:Number,
    required:true
}      
     
});

// Create the model
module.exports = mongoose.model('User', userSchema);