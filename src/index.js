require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Change to true if HTTPS
}));

// Routes
app.use('/', require('./routes/index.routes'));
app.use('/users', require('./routes/users.routes'));
app.use('/skills', require('./routes/skills.routes'));
app.use('/admin', require('./routes/admin.routes'));

const connectToDatabase = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            const dbUri = process.env.NODE_ENV === 'test'
                ? process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/skills-test'
                : process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skills';
            await mongoose.connect(dbUri);
            console.log('Connected to MongoDB');
            console.log('Database:', process.env.NODE_ENV === 'test' ? 'skills-test' : 'skills');
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Only connect to the database if not running tests
if (require.main === module) {
    (async () => {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })();
};

module.exports = { app, connectToDatabase };