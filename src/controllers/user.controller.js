const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const path = require("path");
const fs = require("fs");


const showRegisterForm = (req, res) => {
    res.render('auth/register');
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
    res.render('auth/login', { redirect: req.query.redirect || '/' });
}


const login = async (req, res) => {
    const { username, password, redirect } = req.body;

    if (!username || !password){
        req.flash('error_msg', 'All fields are required');
        return res.redirect('/login');
    }

    const user = await User.findOne({ username });

    if (!user){
        req.flash('error_msg', 'Invalid username or password');
        return res.redirect('/users/login');
    }
    if (!bcrypt.compareSync(password, user.password)){
        req.flash('error_msg', 'Invalid password');
        console.log(req.flash('error_msg'));
        return res.redirect('/users/login');
    }

    req.session.user = { id: user._id, username: user.username, admin: user.admin };
    req.flash('success_msg', 'Login successfully!');
    const redirectUrl = redirect || '/';
    res.redirect(redirectUrl);
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
    const badgesPath = path.join(__dirname, '../public/badges');

    fs.readdir(badgesPath, (err, files) => {
        if (err) {
            console.error('Error al leer la carpeta de badges:', err);
            return res.status(500).send('Error al cargar los badges');
        }

        // Filtrar solo archivos SVG
        const badges = files
            .filter(file => file.endsWith('.svg'))
            .map((file, index) => ({
                rango: `Rango ${index + 1}`, // Generar un rango dinámico
                bitpoints_min: index * 100, // Generar valores mínimos dinámicos
                bitpoints_max: (index + 1) * 100, // Generar valores máximos dinámicos
                svg: `/badges/${file}` // Ruta relativa al archivo SVG
            }));

        res.render('leaderboard', { badges });
    });
};

module.exports = { showRegisterForm, register, showLoginForm, login, logout, viewLeaderboard };