const Model  = require("../models/Category")
module.exports = {
    create : async (req, res) => {
        try {
            const {type} = req.body
            if (!type) return res.status(400).json({message: "not type"})
            const a = await Model.countDocuments({type})
            if (a > 0) return res.status(400).json({message: "tên trùng"})
            await Model.create({type})
            return res.json({message: "tạo loại phòng thành công"})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    },
    update : async (req, res) => {
        try {
            const {type} = req.body
            if (!type) return res.status(400).json({message: "not type"})
            await Model.updateOne({_id: req.params.id}, {$set : {type}})
            return res.json({message: "sửa loại phòng thành công"})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    },
    delete : async (req, res) => {
        try {
            await Model.deleteOne({_id: req.params.id})
            return res.json({message: "sửa loại phòng thành công"})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    } ,
    getList : async (req, res) => {
        try {
            const data = await Model.find()
            return res.json(data)
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }
}