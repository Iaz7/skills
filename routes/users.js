var express = require('express');
const path = require('path');

const app = express();

/* GET home page. */
app.get('/leaderboard', function(req, res) {
  res.sendFile(path.join(__dirname, '/../views/leaderboard.html'));
});

module.exports = app;
