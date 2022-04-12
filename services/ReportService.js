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
                userName: user.name
            },
            postId: payload.id
        })
    }
}

module.exports = reportService