const mongoose = require("mongoose");
const roomType = require('../constants/typeAccomod')

const AccomodSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["draft", "waiting", "approved", "rejected"],
        default: "draft"
    },
    type : {
        type: String,
        default: "Hotel"
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
    images: [{
        public_id: String,
        url: String
    }],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    isRented: {
        type: Boolean,
        default: false
    },
    state: {
        type: Number,
        default: 1,
        enum: [0,1,2]
    },
    postExpired: {
        type: Date,
        default: Date.now()
    },
    point : {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    isPaid : {
        type: Boolean,
        default: false
    },
    moneyPayment : {
        type: Number,
        default: 0
    },
    userLiked : {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Accomodations', AccomodSchema)