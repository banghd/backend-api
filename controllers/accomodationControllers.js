const accomodationService = require('../services/accomodationServices')
const {owner} = require("../constants/roles");

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
            if (Math.abs(req.body.postExpired - new Date()) / (1000 * 3600 * 24) < 10) req.body.isPaid = true
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
    getListRenter : async (req, res) => {
        try {
            const data = await accomodationService.getListRenterAcc(req.query)
            return res.status(200).json(data)
        }
        catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    increaseLikes: async (req,res) => {
        try {
            const {id} = req.params
            if(!id) return res.status(400).json({message: "Vui lòng cung cấp ids"})
            const {id: userId} = req.user
            await accomodationService.increaseLikes(id, userId)
            return res.status(200).json({
                message: "ok"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }

    },
    decreaseLikes: async (req,res) => {
        try {
            const {id} = req.params
            if(!id) return res.status(400).json({message: "Vui lòng cung cấp ids"})
            const {id: userId} = req.user
            await accomodationService.decreaseLikes(id, userId)
            return res.status(200).json({
                message: "ok"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }

    },
    increseViews : async (req,res) => {
        try {
            const {id} = req.params
            if(!id) return res.status(400).json({message: "Vui lòng cung cấp ids"})
            await accomodationService.increaseViews(id)
            return res.status(200).json({
                message: "ok"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }

    },
    getSummary : async (req,res) => {
        console.log('herrr')
        try {
            const result = await accomodationService.getSummary()
            return res.status(200).json({
                message: "success",
                data: result
            })
            } catch (e) {
                return res.status(400).json({
                    message: e.message
                })
        }
     },
    
    payAcc : async  (req, res) => {
        try {
            const {id} = req.params
            if(!id) return res.status(400).json({message: "Vui lòng cung cấp ids"})
            await accomodationService.payAcc(id)
            return res.status(200).json({
                message: "ok"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }

    },
    getAllPosts : async (req,res) => {
        try {
            const result = await accomodationService.getAllPosts(req)
            return res.status(200).json({
                message: "success",
                data: result
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }

    },
    updateState : async (req, res) => {
        try {
            const { state } = req.body
            const { id } = req.params
            const result = await accomodationService.updateState(id, state)
            return res.status(200).json({
                message: "success",
                data: result
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }

    }
}

module.exports = AccomodationControllers
