const jwt = require('jsonwebtoken')
const roles = require('../constants/roles')

const auth = async (req, res, next) => {
    try {
        let token = req.header("Authorization")
        token = token.split(" ")[1]
        if(!token) return res.status(400).json({message: "Invalid Authentication"})

        jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) =>{
            if(err) return res.status(400).json({message: "Invalid Authentication"})

            req.user = user
            next()
        })
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}
const authAdmin = async (req, res, next) => {
    try {
        let user = req.user
        if (user.role !== roles.admin) {
            return res.status(400).json({message: err.message})
        }
        return next()

    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}
module.exports = {auth, authAdmin}