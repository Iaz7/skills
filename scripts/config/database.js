const mongoose = require('mongoose');
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skills');
        console.log('Connected to database');
    } catch(error){
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
module.exports = connectDB;
