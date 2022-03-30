const { getAccomodations } = require('../controllers/accomodationControllers')
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
        return AccomodationModel.create(data)
    },
    updateAccomodation: async (id, data) => {
        const existAccomodation = await AccomodationModel.findOne({_id: id})
        if (!existAccomodation) {
            throw new Error("Nhà trọ không tồn tại !")
        }
        return AccomodationModel.updateOne({_id: id}, data)
    },
    deleteAccomodation: async (id) => {
        const existAccomodation = await AccomodationModel.findOne({_id: id})
        if (!existAccomodation) {
            throw new Error("Nhà trọ không tồn tại !")
        }
        return AccomodationModel.deleteOne({_id: id})

    },
    getAccomodations: async (req) => {
        const data = await AccomodationModel.find({})
        if (!data) {
            throw new Error("Không tìm thấy")
        }
        return data
    },
    UpdateRentedStatus: async (id)=>{
        const accom = await AccomodationModel.findById(id).lean()
        if (!accom){
            throw new Error("Không tìm thấy nhà trọ với id: "+ id)
        }
        return AccomodationModel.updateOne({"_id": id}, {"$set": {"isRented" : !accom.isRented}})
    }
}
module.exports = AccomodationService