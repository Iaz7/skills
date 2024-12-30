const User = require('../models/user.model');
const Badge = require('../models/badge.model');
const UserSkill = require('../models/userskill.model');
const bcrypt = require('bcryptjs');



const showRegisterForm = (req, res) => {
    res.render('auth/register', { redirect: req.query.redirect || '/' });
}


const register = async (req, res) => {
    const { username, password, pass_confirmation } = req.body;

    if (!username || !password || !pass_confirmation){
        req.flash('error_msg', 'All fields are required')
        return res.redirect('/users/register');
    }
    if (password !== pass_confirmation){
        req.flash('error_msg', 'Passwords do not match')
        return res.redirect('/users/register');
    }

    const user = new User({ username, password });
    await user.collection.countDocuments({},(err, count) => {
        user.admin = count === 0;
    });
    const salt = bcrypt.genSaltSync(10);

    user.password = bcrypt.hashSync(password, salt);

    try {
        await user.save();
        req.flash('success_msg', 'User created successfully');
        res.redirect('/users/login');
    } catch (err) {
       req.flash('error', 'Server error');
    };
};

const showLoginForm = (req, res) => {
    const redirect = req.query.redirect || '/';
    req.session.redirect = redirect;
    res.render('auth/login', { redirect });
}


const login = async (req, res) => {
    const { username, password, redirect } = req.body;

    if (!username || !password){
        req.flash('error_msg', 'All fields are required');
        return res.redirect('/login');
    }

    const user = await User.findOne({ username });

    if (!user){
        req.flash('error_msg', 'User not found');
        return res.redirect(`/users/login?redirect=${encodeURIComponent(redirect || '/')}`);
    }
    if (!bcrypt.compareSync(password, user.password)){
        req.flash('error_msg', 'Invalid password');
        return res.redirect(`/users/login?redirect=${encodeURIComponent(redirect || '/')}`);
    }

    req.session.user = { id: user._id, username: user.username, admin: user.admin };
    req.flash('success_msg', 'Login successfully!');
    return res.redirect(redirect || '/');
}

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err){
            req.flash('error', 'Failed to destroy login session');
            return res.redirect('/');
        }
        res.redirect('/users/login');
    });
}


const viewLeaderboard = async (req, res) => {
    const users = await User.find().sort({ points: -1 });
    const userSkills = await UserSkill.find({ verified: true }).populate('skill', 'score');

    users.forEach((user) => {
        let score = 0;
        userSkills.filter(userSkill => user._id.equals(userSkill.user)).forEach((userSkill) => score += userSkill.skill.score);
        user.score = score;
        user.save();
    });

    const badges = await Badge.find().sort({ bitpoints_min: 1 });
    res.render('leaderboard', { users, badges, user: req.session.user });
};

module.exports = { showRegisterForm, register, showLoginForm, login, logout, viewLeaderboard };