const User = require('../models/user.model');
const bcrypt = require('bcryptjs');


/**
 * Renders the registration form.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const showRegisterForm = (req, res) => {
    res.render('auth/register');
}

/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {string} req.body.pass_confirmation - The password confirmation.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
const register = async (req, res) => {
    const { username, password, pass_confirmation } = req.body;

    if (!username || !password || !pass_confirmation) return res.status(400).json({ error: 'ERR_EMPTY', message: 'All fields are required' });
    if (password !== pass_confirmation) return res.status(400).json({ error: 'Passwords do not match' });

    const user = new User({ username, password });
    const salt = bcrypt.genSaltSync(10);

    user.password = bcrypt.hashSync(password, salt);

    try {
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        switch (err.code) {
            case 1: // Internal error (https://www.mongodb.com/docs/manual/reference/error-codes/#mongodb-error-1)
                return res.status(500).json({ error: 'DB_INTERNAL', message: 'Internal DB error' });
            case 6: // Host unreachable (https://www.mongodb.com/docs/manual/reference/error-codes/#mongodb-error-6)
                return res.status(500).json({ error: 'DB_UNREACHABLE', message: 'Host unreachable' });
            case 8: // Unknown error (https://www.mongodb.com/docs/manual/reference/error-codes/#mongodb-error-8)
                return res.status(500).json({ error: 'DB_UNKNOWN', message: 'Unknown DB error' });
            case 89: // Network Timeout (https://www.mongodb.com/docs/manual/reference/error-codes/#mongodb-error-89)
                return res.status(400).json({ error: 'DB_NET_TIMEOUT', message: 'Network timeout' });
            case 121: // Document failed validation (https://www.mongodb.com/docs/manual/reference/error-codes/#mongodb-error-121)
                return res.status(400).json({ error: 'DB_DOC_VALIDATION', message: 'Document failed validation' });
            case 11000: // Duplicate key (https://www.mongodb.com/docs/manual/reference/error-codes/#mongodb-error-11000)
                return res.status(400).json({ error: 'DB_DUPLICATE_KEY', message: 'Duplicate key error' });
            case 14031: // OutOfDiskSpace (https://www.mongodb.com/docs/manual/reference/error-codes/#mongodb-error-14031)
                return res.status(500).json({ error: 'DB_DISK_SPACE', message: 'Out of disk space' });
            default: // Default error
                return res.status(400).json({ error: 'ERR_UNKNOWN', message: `Unknown error: ${err}` });
        };
    };
};

/**
 * Renders the login form.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const showLoginForm = (req, res) => {
    res.render('auth/login', { redirect: req.query.redirect || '/' });
}

/**
 * Handles user login.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
const login = async (req, res) => {
    const { username, password, redirect } = req.body;

    if (!username || !password) return res.status(400).json({ erro: 'ERR_EMPTY', message: 'All fields are required' });

    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ error: 'ERR_INVALID', message: 'Invalid username or password' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error: 'ERR_INVALID', message: 'Invalid username or password' });

    req.session.user = { id: user._id, username: user.username, admin: user.admin };

    const redirectUrl = redirect || '/';
    res.redirect(redirectUrl);
}

/**
 * Logs out the user by destroying the session.
 *
 * @async
 * @function logout
 * @param {Object} req - The request object.
 * @param {Object} req.session - The session object.
 * @param {Function} req.session.destroy - The function to destroy the session.
 * @param {Object} res - The response object.
 * @param {Function} res.status - The function to set the response status.
 * @param {Function} res.json - The function to send a JSON response.
 * @param {Function} res.redirect - The function to redirect the response.
 * @returns {void}
 */
const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'ERR_SESSION', message: 'Failed to destroy login session' });
        res.redirect('/users/login');
    });
}

/**
 * Controller function to view the leaderboard.
 * Fetches all users from the database, sorts them by points in descending order,
 * and renders the 'leaderboard' view with the sorted users.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the leaderboard is rendered.
 */
const viewLeaderboard = async (req, res) => {
    const users = await User.find().sort({ points: -1 });
    res.render('leaderboard', { users });
};

module.exports = { showRegisterForm, register, showLoginForm, login, logout, viewLeaderboard };