var express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../scripts/controllers/auth.controller'); // Importa el controlador

router.get('/leaderboard', (req, res) => res.sendFile(path.join(__dirname, '/../views/leaderboard.html')));
router.get('/electronics', (req, res) => res.sendFile(path.join(__dirname, '/../views/electronics.html')));

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', userController.registerUser); // POST registro
router.post('/login', userController.loginUser); // POST login


module.exports = router;
