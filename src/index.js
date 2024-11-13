const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Other data
const electronics = require('./public/data/electronics.json');

// Routes
app.get('/', (req, res) => {
    res.render('index', { electronics });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});