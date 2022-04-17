const ReportModel = require('../models/ReportAccomod')
const UserModel = require('../models/user')
const AccomodModel = require('../models/accomodation')
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
    },
    listEvalution : async (id) => {
        return ReportModel.find({postId : id, type: "evaluation"})
    },
    userReport : async (id) => {
        const totalPost = await AccomodModel.countDocuments({status: "posted", ownerId : id})
        const likesPost = await AccomodModel.find({likes: {$gt: 0}, ownerId : id})
        const likes = likesPost.reduce((partialSum, a) => partialSum + a.likes, 0)
        const approvePost = await AccomodModel.countDocuments({status: "posted", ownerId : id})
    }
}

module.exports = reportService