const User = require('../models/usersModel')
const bcrypt = require('bcrypt')

// Middleware to check if the user exists
const checkUser = async (req, res, next) => {
   
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields must be filled ' });

        
    }
    try {
        const user = await User.login(email, password);
        req.user = user;
        next();
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}
 
// Middleware to check if the password is correct
const checkPassword = async (req, res, next) => {
    const { password } = req.body;
    try {
        const match = await bcrypt.compare(password, req.user.password);
        if (!match) {
            throw Error('Incorrect password')
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {checkPassword, checkUser}