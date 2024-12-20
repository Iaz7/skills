require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { connect } = require('mongoose');
const session = require('express-session');

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
}))

// Routes
app.use('/', require('./routes/index.routes'));
app.use('/users', require('./routes/users.routes'));
app.use('/skills', require('./routes/skills.routes'));
app.use('/admin', require('./routes/admin.routes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// MongoDB (mongoose)
(async () => {
    try {
        await connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skills');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();