const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res, next) => {
    try{
        console.log(req.body);
        const {username, password} = req.body;
        console.log(username, password);
        const encryptedPassword = password;//await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            password: encryptedPassword
        });
        const userSaved = await newUser.save();
        res.status(201).json(userSaved);

    } catch(error){
        console.log(error);
    }
};
exports.loginUser = async (req, res, next) => {
    //código correspondiente al login
}