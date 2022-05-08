const Model  = require("../models/PersonalFilter")
module.exports = {
    create : async (req, res) => {
        try {
            const {name, query} = req.body
            if (!name || !query) return res.status(400).json({message: "thiếu field"})
            const a = await Model.countDocuments({name})
            if (a > 0) return res.status(400).json({message: "tên trùng"})
            await Model.create({name, query, userId: req.user.id})
            let data = await Model.findOne({name})
            return res.json({message: "tạo loại phòng thành công", data})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    },
    update : async (req, res) => {
        try {
            const {query, name} = req.body
            let assrt = {}
            if(query) assrt.query = query
            if(name) assrt.name = name
            if(isEmpty(assrt)) return res.json({message: "k có gì update"})
            await Model.updateOne({_id: req.params.id}, {$set : assrt})
            return res.json({message: "sửa bộ lọc thành công"})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    },
    delete : async (req, res) => {
        try {
            await Model.deleteOne({_id: req.params.id})
            return res.json({message: "xoá bộ lọc thành công"})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    } ,
    getList : async (req, res) => {
        try {
            const data = await Model.find({userId: req.user.id})
            return res.json(data)
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }
}
function isEmpty(obj) {
    for(var prop in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}