
const bcrypt = require('bcrypt')

// Middleware to encrypt the password
const encryptPassword = async (req, res, next) => {
    const { password } = req.body;
    if (password) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          req.body.password = hash;
        } catch (err) {
          return res.status(500).json({ message: err.message });
        }
      }
      next(); 
}


module.exports = {encryptPassword}

