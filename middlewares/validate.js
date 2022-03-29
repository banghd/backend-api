const joi = require("joi")
const constants = require("../constants/roles")
const typeAccomod = require("../constants/typeAccomod")
const validateSignIn = async (req, res, next) => {
    const data = req.body
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        role: joi.number().positive().required().greater(1).message("role user must greater than 1").integer()
    })
    const {value, error} = schema.validate(data)
    if (error) {
        return res.status(400).json({message: error.message})
    }
    value.email = value.email.toLowerCase()
    req.body = value
    next()
}

const validateLogIn = async (req, res, next) => {
    const data = req.body
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    })
    const {value, error} = schema.validate(data)
    if (error) {
        return res.status(400).json({message: error.message})
    }
    value.email = value.email.toLowerCase()
    req.body = value
    next()
}

const validateUser = async (req, res, next) => {
    const data = req.body
    const schema = joi.object({
        id: joi.string().required(),
        name: joi.string().trim(),
        birthDay: joi.string(),
        sex: joi.bool(),
        address: {
            district: joi.string().trim().allow(null, ""),
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
        return res.status(400).json({message: error.message})
    }
    req.body = value
    next()
}

const validateAccomodation = async (req, res, next) => {
    const data = req.body
    if (req.method == 'POST') data.ownerId = req.user.id

    const schema = joi.object({
        status: joi.string().valid("draft", "posted", "approved"),
        type: joi.number().required(),
        address: {
            district: joi.string().trim().required(),
            ward: joi.string().trim().required(),
            detail: joi.string().trim().required()
        },
        area: joi.number().positive().required(),
        price: {
            unit: joi.string().trim().required(),
            quantity: joi.number().positive().required(),
        },
        public_location: joi.string().trim().required(),
        sameOwner: joi.bool().required(),
        bedRoom: joi.number().required(),
        bathRoom: joi.bool().required(),
        kitchen: joi.bool().required(),
        balcony: joi.bool().required(),
        aircondition: joi.bool().required(),
        detailedPost: {
            title: joi.string().required(),
            content: joi.string().required()
        },
        ownerId: joi.string(),
        images: joi.array(),
    })
    const {error, value} = schema.validate(data)
    console.log(value)
    if (error) {
        return res.status(400).json({message: error.message})
    }
    req.body = value
    next()
}

module.exports = {validateSignIn, validateLogIn, validateUser, validateAccomodation}