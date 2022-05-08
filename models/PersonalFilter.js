const mongoose = require('mongoose')

const PersonalFilter = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    query : {
        type: mongoose.Schema.Types.Mixed,
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('PersonalFilters', PersonalFilter)