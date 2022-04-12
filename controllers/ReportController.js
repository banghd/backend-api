const reportService = require('../services/ReportService')

const reportCtrl = {
    createComment : async (req, res) =>{
        try {
            const {id} = req.body
            if (!id) return res.status(400).json({
                message: "vui lòng cung cấp id"
            })
            req.body.userId = req.user.id
            await reportService.createComment(req.body)
            return res.json({
                message: "ok"
            })
        }
        catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    }

}

module.exports = reportCtrl