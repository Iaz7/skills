const { Router } = require('express');
const router = Router();
const ranks = require('../public/data/ranks.json');

router.get('/leaderboard', (req, res) => {
    console.log('Acessing /users/leaderboard');
    res.render('leaderboard', { ranks });
});

module.exports = router;