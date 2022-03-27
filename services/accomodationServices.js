const AccomodationModel = require('../models/accomodation')

const AccomodationService = {
    getAccomodation: async (id) => {
        const data = await AccomodationModel.findOne({_id: id})
        if (!data) {
            throw new Error("Không tìm thấy")
        }
        return data
    },
    createAccomodation: async (data) => {
        const accomodation = await AccomodationModel.create(data)
        return accomodation
    },
    updateAccomodation: async (id, data) => {
        const existAccomodation = await AccomodationModel.findOne({id: id})
        if (!existAccomodation) {
            throw new Error("Nhà trọ không tồn tại !")
        }
        const accomodation = await AccomodationModel.update(data)
        return accomodation
    },
    deleteAccomodation: async (id) => {
        const existAccomodation = await AccomodationModel.findOne({id: id})
        if (!existAccomodation) {
            throw new Error("Nhà trọ không tồn tại !")
        }
        const result = await AccomodationModel.delete(data)
        return result
    }
}
module.exports = AccomodationService