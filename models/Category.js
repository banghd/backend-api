const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    type: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('Categories', CategorySchema)