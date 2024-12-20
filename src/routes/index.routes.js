const { Router } = require('express');
const router = Router();
const electronics = require('../public/data/electronics.json');

router.get('/', (req, res) => res.render('index', { electronics, user: req.session.user || null }));

module.exports = router;