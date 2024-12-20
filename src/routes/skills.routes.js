const express = require('express');
const router = express.Router();
const { isAdmin, isAuthenticated } = require('../middleware/auth.middleware');
const skillsController = require('../controllers/skills.controller');

// Redirect to electronics skill tree by default
router.get('/', (req, res) => res.redirect('/skills/electronics'));

// User routes
router.get('/:skillTree', isAuthenticated, skillsController.viewSkills);
router.get('/:skillTree/view/:skillID', isAuthenticated, skillsController.viewSkill);
router.post('/:skillTree/submit-evidence', isAuthenticated, skillsController.submitEvidence);

// Admin routes
router.get('/:skillTree/add', isAdmin, skillsController.addSkillForm);
router.post('/:skillTree/add', isAdmin, skillsController.addSkill);
router.post('/:skillTree/:skillID/verify', isAdmin, skillsController.verifySkill);
router.get('/:skillTree/edit/:skillID', isAdmin, skillsController.editSkillForm);
router.post('/:skillTree/edit/:skillID', isAdmin, skillsController.editSkill);
router.post('/:skillTree/delete/:skillID', isAdmin, skillsController.deleteSkill);

module.exports = router;