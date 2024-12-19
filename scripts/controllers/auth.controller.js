const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res, next) => {
    try{
        console.log(req.body);
        const {username, password} = req.body;
        console.log(username, password);

        const encryptedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            username: username,
            password: encryptedPassword,
            score: 1,
            admin: false,
            completedSkills: []
        });
        const userSaved = await newUser.save();
        res.status(201).json(userSaved);

    } catch(error){
        console.log(error);
    }
};
exports.loginUser = async (req, res, next) => {
    console.log(req.body);
    const {userNameL: username, passwordL: password} = req.body;
    console.log(username, password);
    if (!username || !password) {
        return res.status(400).json({error: 'ERR_EMPTY', message: 'All fields are required'});
    }
    const user = await User.findOne({ username });
    if (!user){
        return res.status(400).json({ error: 'ERR_INVALID', message: 'Invalid username or password' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({error: 'ERR_INVALID', message: 'Invalid username or password'});
    }

    req.session.user = { id: user._id, username: user.username };

    res.status(200).json({ message: 'User logged in successfully' });
}