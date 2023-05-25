const jwt = require('jsonwebtoken');
const User = require('../models/usersModel')

const requireAuth = async (req, res, next) => {

    //verify authentication
    const { authorization } = req.headers

    if (!authorization){
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try {
        //grab id from token
      const { _id } = jwt.verify(token, process.env.SECRET)

      //find user in DB based on id
      req.user = await User.findOne({ _id }).select('_id')
      
      next()


    }catch (error){
        console.log(error)
        res.status(401).json({error: 'Request is not authorized'})
    }
}


module.exports = requireAuth