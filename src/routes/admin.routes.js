const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

// Admin dashboard
router.get('/dashboard', isAdmin, adminController.dashboard);

// Manage badges
router.get('/badges', isAdmin, adminController.viewBadges);
router.get('/badges/edit/:id', isAdmin, adminController.editBadgeForm);
router.post('/badges/edit/:id', isAdmin, adminController.editBadge);
router.post('/badges/delete/:id', isAdmin, adminController.deleteBadge);

// Manage users
router.get('/users', isAdmin, adminController.viewUsers);
router.post('/change-password', isAdmin, adminController.changePassword);

module.exports = router;