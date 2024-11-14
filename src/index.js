const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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

console.log(app._router.stack); // This will print the middleware stack