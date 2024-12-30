const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Registration
router.get('/register', userController.showRegisterForm);
router.post('/register', userController.register);

// Login
router.get('/login', userController.showLoginForm);
router.post('/login', userController.login);

// GitHub OAuth
router.get('/auth/github', (req, res, next) => {
    req.session.redirectUrl = req.query.redirect;
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/users/login' }),
    (req, res) => {
        req.session.user = req.user;
        req.flash('success_msg', 'Logged in with GitHub successfully!');
        res.redirect(req.session.redirectUrl || '/');
    }
);

// Logout
router.get('/logout', isAuthenticated, userController.logout);

// Leaderboard
router.get('/leaderboard', isAuthenticated, userController.viewLeaderboard);

module.exports = router;