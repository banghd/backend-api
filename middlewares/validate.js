const joi = require("joi")
const constants = require("../constants/roles")
const validateSignIn = async (req,res, next)=> {
    const data = req.body
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        role: joi.number()
    })
    const {value, error} = schema.validate(data)
    if (error) {
        res.status(400).json({message : error.message})
    }
    req.body = value
    next()
}

const validateLogIn = async (req,res, next)=> {
    const data = req.body
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    })
    const {value, error} = schema.validate(data)
    if (error) {
        res.status(400).json({message : error.message})
    }
    req.body = value
    next()
}
module.exports = {validateSignIn, validateLogIn}