const mongoose = require('mongoose')
const roles = require('../constants/roles')
const constants = require("../constants/roles");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: Number,
        default: roles.renter,
        enum: [constants.renter, constants.owner, constants.admin]
    },
    birthDay: {
      type: Date,
    },
    sex: {
        type: Boolean,
        default: true
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
        public_id : {
            type: String,
            default: ""
        },
        url : {
            type: String,
            default: "https://file4.batdongsan.com.vn/images/default-user-avatar-blue.jpg"
        }
    } ,
    zalo : String,
    state: {
        type: Number,
        default: 1,
        enum: [1,2,3]
    },
    resetToken: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)