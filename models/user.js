const mongoose = require('mongoose')
const roles = require('../constants/roles')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: roles.renter
    },
    sex: {
        type : Number,
        enum : [0, 1],
        default: 1
    },
    address : {
        district : {
            type: String, //quận
        },
        ward : {
            type: String, // huyện
        },
        detail : String
    },
    phoneNumber : String,
    CCCD: String,
    avatar : {
        public_id : String,
        url : String
    } ,
    zalo : String
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)