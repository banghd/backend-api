const reportService = require('../services/ReportService')

const reportCtrl = {
    createComment : async (req, res) =>{
        try {
            const {id} = req.body
            if (!id) return res.status(400).json({
                message: "vui lòng cung cấp id"
            })
            req.body.userId = req.user.id
            const data = await reportService.createComment(req.body)
            return res.json({
                message: "ok",
                data
            })
        }
        catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    createReport: async (req, res) => {
        try {
            const {id} = req.body
            if (!id) return res.status(400).json({
                message: "vui lòng cung cấp id"
            })
            req.body.userId = req.user.id
            await reportService.createReport(req.body)
            return res.json({
                message: "ok"
            })
        }
        catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    listComment: async (req, res) => {
        try {
            const {id} = req.params
            if (!id) return res.status(400).json({
                message: "vui lòng cung cấp id"
            })
            let data = await reportService.listComment(id)
            return res.json(data)
        }
        catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    listEvalution : async (req, res) => {
        try {
            const {id} = req.params
            if (!id) return res.status(400).json({
                message: "vui lòng cung cấp id"
            })
            let data = await reportService.listEvalution(id)
            return res.json(data)
        }
        catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    userReport : async (req, res) =>{
        try {
            const {userId} = req.params
            if (!userId) return res.status(400).json({
                message: "vui lòng cung cấp id"
            })
            let data = await reportService.userReport(userId)
            return res.json(data)
        }
        catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    deleteReport : async (req, res ) => {
        try {
            await reportService.deleteReport(req.params.id)
            return res.json({message: "ok"})
        }
        catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    getLisstReport : async (req, res) => {
        const model = require("../models/ReportAccomod")
        const data = await model.find({type: "report"})
        return res.json(data)
    }

}

module.exports = reportCtrl