const jwt = require('jsonwebtoken')

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
module.exports = {auth}