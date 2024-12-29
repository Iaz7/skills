const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path');

const { isAdmin, isAuthenticated } = require('../middleware/auth.middleware');
const skillsController = require('../controllers/skills.controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img/skills');
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        if (extname !== '.svg') {
            return cb(new Error('Solo se permiten archivos SVG.'));
        }
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname === '.svg') {
        return cb(null, true);
    } else {
        return cb(new Error('Solo se permiten archivos SVG.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
});

// Redirect to electronics skill tree by default
router.get('/', (req, res) => res.redirect('/skills/electronics'));

// User routes
router.get('/:skillTree', isAuthenticated, skillsController.viewSkills);
router.get('/:skillTree/view/:skillID', isAuthenticated, skillsController.viewSkill);
router.post('/:skillTree/submit-evidence', isAuthenticated, skillsController.submitEvidence);

// Admin routes
router.get('/:skillTree/add', isAdmin, skillsController.addSkillForm);
router.post('/:skillTree/add', upload.single('icon'), isAdmin, skillsController.addSkill);
router.post('/:skillTree/:skillID/verify', isAuthenticated, skillsController.verifySkill);
router.get('/:skillTree/edit/:skillID', isAdmin, skillsController.editSkillForm);
router.post('/:skillTree/edit/:skillID', upload.single('icon'), isAdmin, skillsController.editSkill);
router.post('/:skillTree/delete/:skillID', isAdmin, skillsController.deleteSkill);

module.exports = router;