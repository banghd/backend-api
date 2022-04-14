const ReportModel = require('../models/ReportAccomod')
const UserModel = require('../models/user')
const reportService = {
    createComment: async (payload) => {
        const user = await UserModel.findById(payload.userId)
        await ReportModel.create({
            type: payload.type,
            metadata: payload.comment,
            createBy: {
                userId: user._id,
                userName: user.name,
                avatar: user.avatar
            },
            postId: payload.id
        })
        return {
            coment: payload.comment,
            username : user.name,
            avatar: user.avatar
        }
    },
    createReport: async (payload) => {
        const user = await UserModel.findById(payload.userId)
        await ReportModel.create({
            type: payload.type,
            metadata: payload.content,
            createBy: {
                userId: user._id,
                userName: user.name
            },
            postId: payload.id
        })
    },
    listComment: async (id) => {
        return ReportModel.find({postId : id, type: "comment"})
    }
}

module.exports = reportService