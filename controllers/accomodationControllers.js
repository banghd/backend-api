const accomodationService = require('../services/accomodationServices')
const userService = require("../services/userServices");

const AccomodationControllers = {
    getdata: async (req, res) => {
        try {
            const {id} = req.params
            if (!id) return res.status(400).json({message: "Vui lòng cung cấp id"})
            const data = await accomodationService.getAccomodation(id)
            return res.json(data)
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }

    },
    createAccomodation: async (req, res, auth) => {
        try {
            const result = await accomodationService.createAccomodation(req.body)
            return res.status(200).json({
                data: result,
                message: "Tạo nhà trọ thành công"
            })
        } catch(e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    updateAccomodation: async (req, res) => {
        try {
            const result = await accomodationService.updateAccomodation(req.params.id, req.body)
            return res.status(200).json({
                data: result,
                message: "Cập nhật nhà trọ thành công"
            })
        } catch(e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    deleteAccomodation: async (req, res) => {
        try {
            const {id} = req.params
            if (!id) return res.status(400).json({message: "Vui lòng cung cấp id"})
            const data = await accomodationService.deleteAccomodation(id)
            return res.status(200).json({
                data: data,
                message: "Xoá nhà trọ thành công!"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    getAccomodations: async (req, res) => {
        try {
            const data = await accomodationService.getAccomodations(req)
            return res.json(data)
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    updateRentedStatus: async (req, res) => {
        try {
            const {id} = req.params
            if (!id) return res.status(400).json({
                message: "Vui lòng cung cấp id"
            })
            await accomodationService.UpdateRentedStatus(id)
            return res.status(200).json({
                message: "Câp nhật trạng thái thuê trọ thành công"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    getUserListAccomod: async (req, res) =>{
        try {
            const {id} = req.query
            if (!id) return res.status(400).json({
                message: "Vui lòng cung cấp id user"
            })
            const data = await accomodationService.getUserListAccomod(req.query)
            return res.json(data)
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    deleteMultiple: async (req, res) => {
        try {
            const { ids, ownerId } = req.body
            if (ids.length == 0) return res.status(400).json({message: "Vui lòng cung cấp ids"})
            const data = await accomodationService.deleteMultiple(ids, ownerId)
            return res.status(200).json({
                data: data,
                message: "Xoá các nhà trọ thành công!"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    getAccomodationsFilter : async (req, res) =>{
        try {
            const {limit, page} = req.query
            const data = await accomodationService.getListAccFilter(limit, page)
            return res.json(data)
        } catch (e){
            return res.status(400).json({
                message: e.message
            })
        }
    }
}

module.exports = AccomodationControllers
