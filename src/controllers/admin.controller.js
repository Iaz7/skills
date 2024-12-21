const Badge = require('../models/badge.model');
const User = require('../models/user.model');

// Dashboard
const dashboard = (req, res) => {
    res.render('admin/dashboard', { user: req.session.user });
};

// View all badges
const viewBadges = async (req, res) => {
    const badges = await Badge.find();
    res.render('admin/badges/list', { user: req.session.user, badges });
};

// Edit badge form
const editBadgeForm = async (req, res) => {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
        return res.status(404).render('errors/404', {
            title: 'Badge not found',
            message: 'The badge you are looking for does not exist.',
            route: `/admin/badge/edit/${req.params.id}`
        });
    }
    res.render('admin/badges/edit', { user: req.session.user, badge });
};

// Edit badge logic
const editBadge = async (req, res) => {
    try {
        await Badge.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/badges');
    } catch (err) {
        res.status(500).render('errors/500', { error: 'Failed to update badge' });
    }
};

// Delete badge
const deleteBadge = async (req, res) => {
    try {
        await Badge.findByIdAndDelete(req.params.id);
        res.redirect('/admin/badges');
    } catch (err) {
        res.status(404).render('errors/404', {
            title: 'Badge not found',
            message: 'The badge you are looking for does not exist.',
            route: `/admin/badge/delete/${req.params.id}`
        });
    }
};

// View users and admin status
const viewUsers = async (req, res) => {
    const users = await User.find();
    res.render('admin/users', { user: req.session.user, users });
};

// Change user password
const changePassword = async (req, res) => {
    const { userID, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userID, { password: hashedPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).render('errors/500', { error: 'Failed to update password' });
    }
};

module.exports = { dashboard, viewBadges, editBadgeForm, editBadge, deleteBadge, viewUsers, changePassword };