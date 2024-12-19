const { Router } = require('express');
const router = Router();
const ranks = require('../public/data/ranks.json');
const authController = require('../controllers/auth.controller');

router.get('/leaderboard', (req, res) => res.render('leaderboard', { ranks }));

// Frontend login & register routes
router.get('/login', (req, res) => res.render('auth'));
router.get('/register', (req, res) => res.render('auth'));
router.get('/logout', (req, res) => authController.logout(req, res));


// API login & register routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;