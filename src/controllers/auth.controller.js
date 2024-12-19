const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

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
                return res.status(400).json({ error: err });
        };
    };
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ erro: 'ERR_EMPTY', message: 'All fields are required' });
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ error: 'ERR_INVALID', message: 'Invalid username or password' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error: 'ERR_INVALID', message: 'Invalid username or password' });

    req.session.user = { id: user._id, username: user.username };

    res.status(200).json({ message: 'User logged in successfully' });
}

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'ERR_SESSION', message: 'Failed to destroy login session' });
        res.status(200).json({ message: 'User logged out successfully' });
    });
    res.redirect('/');
}

module.exports = { register, login, logout };