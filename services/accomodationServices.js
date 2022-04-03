const { default: mongoose } = require('mongoose')
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
    },
    getUserListAccomod: async (payload) => {
        const query = {}
        query.ownerId = payload.id
        if (payload.isRented == "true") query.isRented = true
        if (payload.isRented == "false") query.isRented = false
        if (payload.isExpired == "true") query.postExpired = {"$lte": new Date()}
        if (payload.isExpired == "false") query.postExpired = {"$gte": new Date()}
        if (payload.title) {
            query["detailedPost.title"] = {"$regex": payload.title}
        }
        if(payload.isApproved)query.isApproved = parseInt(payload.isApproved)

        const total = await AccomodationModel.countDocuments(query)
        //pagination
        let limit, skip
        payload.limit ? limit = parseInt(payload.limit) : limit = 10
        skip = (parseInt(payload.page ? payload.page : "1") - 1 ) * limit
        const option = {_id : -1, "detailedPost.title": 1}
        if (payload.sortByDate == "1") option._id = 1
        if (payload.sortByTitle == "-1")option["detailedPost.title"] = -1
        const data = await AccomodationModel.find(query).limit(limit).skip(skip).sort(option).lean()
        return {
            message : "ok",
            data: {
                data,
                total: total,
                page: parseInt(payload.page)
            }
        }
    },
    deleteMultiple: async (ids, ownerId) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await AccomodationModel.deleteMany({ownerId : ownerId, _id: {$in : ids}})
            await session.commitTransaction();
            session.endSession();
            return true;
        } catch (error) {
            // If an error occurred, abort the whole transaction and
            // undo any changes that might have happened
            await session.abortTransaction();
            session.endSession();
            throw error; 
        }
    },
}
module.exports = AccomodationService