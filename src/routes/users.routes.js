const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Registration
router.get('/register', userController.showRegisterForm);
router.post('/register', userController.register);

// Login
router.get('/login', userController.showLoginForm);
router.post('/login', userController.login);

// Logout
router.get('/logout', isAuthenticated, userController.logout);

// Leaderboard
router.get('/leaderboard', isAuthenticated, userController.viewLeaderboard);

module.exports = router;