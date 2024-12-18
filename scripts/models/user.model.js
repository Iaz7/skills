const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password:{
      type: String,
      minLength: 6
    }
});

module.exports = mongoose.model('User', userSchema);