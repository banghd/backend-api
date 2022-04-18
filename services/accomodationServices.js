const { default: mongoose } = require('mongoose')
const AccomodationModel = require('../models/accomodation')
const {owner} = require("../constants/roles");

const AccomodationService = {
    getAccomodation: async (id) => {
        const data = await AccomodationModel.findOne({_id: id}).populate({
            path: "ownerId",
        })
        if (!data) {
            throw new Error("Không tìm thấy")
        }
        renameProperty(data, "ownerId", "userInfo")
        console.log(data)
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
        if (data.update) return  AccomodationModel.updateOne({_id: id}, {postExpired: data.postExpired})
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
        if (payload.status != "") query.status = payload.status
        if (payload.title) {
            query["detailedPost.title"] = {"$regex": payload.title}
        }
        if(payload.state)query.state = parseInt(payload.state)

        const total = await AccomodationModel.countDocuments(query)
        //pagination
        let limit, skip
        payload.limit ? limit = parseInt(payload.limit) : limit = 10
        skip = (parseInt(payload.page ? payload.page : "1") - 1 ) * limit
        const option = {}
        if (payload.sortByDate == "1") option["_id"] = 1
        if (payload.sortByDate == "-1") option["_id"] = -1
        if (payload.sortByTitle == "-1")option["detailedPost.title"] = 1
        if (payload.sortByTitle == "1")option["detailedPost.title"] = -1
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
    getListRenterAcc: async (payload) =>{
        const query = {status : "approved", isRented: false}
        if (payload.type) query.type = parseInt(payload.type)
        if(payload.district) query["address.district"] = payload.district
        if(payload.ward) query["address.ward"] = payload.ward
        if(payload.public_location)query.public_location = {$regex: payload.public_location}
        let area = {}
        let opt = {}
        if(payload.minArea) area["$gte"] = parseInt(payload.minArea)
        if(payload.maxArea) area["$lte"] = parseInt(payload.maxArea)

        if (!isEmpty(area)) query.area = area
        if (payload.bedRoom)query.bedRoom = parseInt(payload.bedRoom)
        //sỏting
        if (payload.sortByLike == "false")opt["likes"] = 1
        if (payload.sortByLike == "true") opt["likes"] = -1

        const total = await AccomodationModel.countDocuments(query)
        if (isEmpty(opt)) opt = {_id: -1}

        //paginate
        let page, limit
        query.page ?  page= parseInt(query.page)  : page = 1
        query.limit ? limit = parseInt(query.limit) : limit = 10
        const data = await AccomodationModel.find(query).populate({path : "ownerId"}).skip((page - 1) * limit).limit(limit).sort(opt)
        return {
            total,
            data,
            page,
            limit,
            message: "ok"
        }
    },
    increaseLikes :  async  (id, userId) => {
        return AccomodationModel.updateOne({_id: id}, {$inc : {likes: 1}, $push: {userLiked : userId}})
    },
    decreaseLikes :  async  (id, userId) => {
        return AccomodationModel.updateOne({_id: id}, {$inc : {likes: -1}, $pull: {userLiked: userId}})
    },
    increaseViews : async  (id) => {
        return AccomodationModel.updateOne({_id: id}, {$inc: {view: 1}})
    },
    getSummary: async ()=> {
        const posts = await AccomodationModel.count()
        const paid = await AccomodationModel.where('isPaid', true).count()
        const notApprove = await AccomodationModel.where('status', "waiting").count()
        const approved = await AccomodationModel.where('status', "approved").count()
        return {
            posts,
            paid,
            approved,
            notApprove
        }
    },
    getAllPosts: async (req) => {
        const query = req.query
        let page, limit
        query.page ?  page= parseInt(query.page)  : page = 1
        query.limit ? limit = parseInt(query.limit) : limit = 10
        const data = await AccomodationModel.find(query).skip((page - 1) * limit).limit(limit).sort({'createdAt': 'desc'})
        return data
    },
    payAcc : async (id) => {
        return AccomodationModel.updateOne({_id: id}, {isPaid: true})
    },
    updateState : async (id, status) => {
        return AccomodationModel.updateOne({_id: id}, {status})
    }
}
module.exports = AccomodationService

function isEmpty(obj) {
    for(var prop in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function renameProperty(obj, oldName, newName) {
    obj[newName] = obj[oldName];
    delete obj[oldName];
}