const joi = require("joi")
const constants = require("../constants/roles")
const validateSignIn = async (req,res, next)=> {
    const data = req.body
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        role: joi.number().positive().required().greater(1).message("role user must greater than 1").integer()
    })
    const {value, error} = schema.validate(data)
    if (error) {
        return res.status(400).json({message : error.message})
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
        return res.status(400).json({message : error.message})
    }
    req.body = value
    next()
}

const validateUser = async (req, res, next) => {
    const data = req.body
    const schema = joi.object({
        id: joi.string().required(),
        name : joi.string().trim(),
        birthDay: joi.string(),
        sex: joi.bool(),
        address: {
            district : joi.string().trim().allow(null, ""),
            ward: joi.string().trim().allow(null, ""),
            detail: joi.string().trim().allow(null, "")
        },
        phoneNumber: joi.string().trim(),
        CCCD: joi.string().trim(),
        zalo: joi.string().allow(""),
        avatar: {
            public_id: joi.string().required(),
            url: joi.string().uri().required()
        },
        password: joi.string().trim()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).allow("")
    })
    const {error, value} = schema.validate(data)
    console.log(value)
    if (error) {
        return res.status(400).json({message : error.message})
    }
    req.body = value
    next()
}
module.exports = {validateSignIn, validateLogIn, validateUser}