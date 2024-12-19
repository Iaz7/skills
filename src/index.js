require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { connect } = require('mongoose');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index.routes'));
app.use('/users', require('./routes/users.routes'));

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