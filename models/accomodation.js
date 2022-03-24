const mongoose = require("mongoose");
const roomType = require('../constants/typeAccomod')

const AccomodSchema = new mongoose.Schema({
    type : {
        type: Number,
        enum: Object.values(roomType),
        default: roomType.motel
    } ,
    address : {
        district : {
            type: String,
            default : "",
        },
        ward : {
            type: String,
            default: ""
        } ,
        detail : {
            type: String,
            default: ""
        }
    },
    area : {
        type: Number,
        default: 0
    },
    price : {
        unit : {
            type: String,
            default: "Tháng"
        },
        quantity : {
            type: Number,
            default: 0
        }
    },
    public_location : {
        type : String,
        default : ""
    },
    sameOwner : {
        type: Boolean,
        default: true
    },
    bedRoom : {
        type: Number,
        default: 1
    },
    bathRoom : {
        type: Boolean,
        default: true
    },
    kitchen : {
        type: Boolean,
        default: true
    },
    balcony : {
        type: Boolean,
        default: true
    },
    aircondition : {
        type: Boolean,
        default: true
    },
    detailedPost : {
        title: {
            type : String,
            default: ""
        },
        content: {
            type: String,
            default: ""
        }
    },
    image: {
        public_id: String,
        url: String
    }
})
module.exports = mongoose.model('Accomodations', AccomodSchema)