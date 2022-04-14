const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    type: {
        type: String,
        default: ""
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    postId: {
        type : mongoose.Schema.Types.ObjectId,
    },
    createBy: {
        userId: String,
        userName: String,
        avatar: {
            type: Object
        }
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Reports', ReportSchema)