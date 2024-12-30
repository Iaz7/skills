const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user.model');

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be provided in the environment variables');
}

const protocol = process.env.HTTPS_COOKIE.toLowerCase() === 'false' ? 'http' : 'https';
const domain = process.env.DOMAIN || 'localhost';
const port = process.env.PORT || 3000;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${protocol}://${domain}:${port}/users/auth/github/callback`
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        let user = await User.findOne({ $or: [{ githubId: profile.id }, { username: profile.username }] });
        if (!user) {
            const isAdmin = !(await User.exists({}));
            user = new User({
                username: profile.username,
                githubId: profile.id,
                admin: isAdmin
            });
            await user.save();
        }

        return cb(null, user);
    } catch (err) {
        return cb(err, null);
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
    try {
        const user = await User.findById(id);
        cb(null, user);
    } catch (err) {
        cb(err, null);
    }
});

module.exports = passport;