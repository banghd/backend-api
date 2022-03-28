const accomodationService = require('../services/accomodationServices')

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
    }
}

module.exports = AccomodationControllers