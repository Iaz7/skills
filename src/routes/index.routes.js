const { Router } = require('express');
const router = Router();
const electronics = require('../public/data/electronics.json');
const Skill = require('../models/skill.model');

router.get('/', (req, res) => res.render('index', { electronics, user: req.session.user || null }));
router.get('/skills', (req, res) => res.redirect('/'));
router.get('/skills/edit', (req, res) => res.redirect('/'));

router.get('/skills/:skillTree/edit/:id', async (req, res) => {
    const { skillTree, id } = req.params;
    if (isNaN(id)) return res.redirect('/');
    const skill = await Skill.find({ id });
    if (!skill) return res.status(404).render('errors/404', {
        title: 'Skill not found',
        message: 'The skill you are looking for does not exist.',
        route: `/skills/${id}`
    });
    // Filter the skill tree ("set" attribute in the JSON file) and the skill ID
    let filtered = skill.filter(skill => skill.set === skillTree);
    // If the skill tree is not found, return 404
    if (!filtered.length) return res.status(404).render('errors/404', {
        title: 'Skill not found',
        message: 'The skill you are looking for does not exist.',
        route: `/skills/${skillTree}/${id}`
    });
    return res.render('edit_skill', { skill: filtered[0] });
});

router.get('/skills/:skillTree/:id', async (req, res) => {
    const { skillTree, id } = req.params;
    if (isNaN(id)) return res.redirect('/');
    const skill = await Skill.findOne({ id });
    if (!skill) return res.status(404).render('errors/404', {
        title: 'Skill not found',
        message: 'The skill you are looking for does not exist.',
        route: `/skills/${skillTree}/${id}`
    });
    return res.render('skill', { skill });
});

module.exports = router;