const UserModel = require('../models/user')
const AccomdModel =require('../models/accomodation')
const ReportModel = require('../models/ReportAccomod')
const bcrypt = require("bcrypt")
const constants = require("../constants/roles")
const jwt = require('jsonwebtoken')
const moment = require('moment')
const nodemail = require("nodemailer")

const {isString} = require("mocha/lib/utils");
const userService = {
    getdata: async (id) => {
        const data = await UserModel.findOne({_id: id}).select("-password")
        if (!data) {
            throw new Error("Cannot find user")
        }
        const accomods = await AccomdModel.find({ownerId: id}).lean()
        const waiting = accomods.filter(x => x.status === "waiting").length
        const approve = accomods.filter(x => x.status === "approved").length
        const reject = accomods.filter(x => x.status === "rejected").length
        const likes = accomods.reduce((sum,b)=> sum + b.likes, 0)
        let report = {waiting, approve, reject, likes}
        return {data, report}
    },
    createUser: async (data) => {
        const existUser = await UserModel.findOne({email: data.email})
        if (existUser) {
            throw new Error("Existed user !")
        }
        const rndInt = Math.floor(Math.random() * 10) + 1
        const hashPass = bcrypt.hashSync(data.password, rndInt)
        const user = await UserModel.create({
            email: data.email,
            password: hashPass,
            role: data.role,
            state: data.role !== constants.owner ? 2 : 1
        })
        const accessToken = jwt.sign({
            email: data.email,
            role: data.role ? data.role : constants.renter,
            id : user._id
        }, process.env.JWT_ACCESS_TOKEN, {expiresIn: "1d"})
        const refreshToken = jwt.sign({
            email: data.email,
            role: data.role ? data.role : constants.renter,
            id : user._id
        }, process.env.JWT_REFRESH_TOKEN, {expiresIn: "7d"})
        return {accessToken, refreshToken}
    },
    logIn: async (data) => {
        const existUser = await UserModel.findOne({email: data.email})
        if (!existUser) {
            throw new Error("User not existed !")
        }
        const comparePass = bcrypt.compareSync(data.password, existUser.password)
        if (!comparePass) {
            throw new Error("Pass word incorrect")
        }
        const accessToken = jwt.sign({
            email: existUser.email,
            role: existUser.role,
            id: existUser._id
        }, process.env.JWT_ACCESS_TOKEN , {expiresIn: "1d"})
        const refreshToken = jwt.sign({
            email: existUser.email,
            role: existUser.role,
            id: existUser._id
        }, process.env.JWT_REFRESH_TOKEN, {expiresIn: "7d"})
        return {accessToken, refreshToken}
    },
    GetRefreshToken: async (token) => {
        try {
            const decoded = await jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
            return jwt.sign({
                email: decoded.email,
                role: decoded.role,
                id: decoded._id
            }, process.env.JWT_ACCESS_TOKEN, {expiresIn: "1d"})
        } catch (e){
            console.log(e.message)
            throw new Error(e.message)
        }
    },
    updateUser: async (payload) => {
            const query = buildQuery(payload)
            const update = await UserModel.updateOne({_id: payload.id}, query)
            if (!update.modifiedCount)throw new Error("unable to update user info")
        return UserModel.findOne({_id: payload.id})
    },
    updatePass: async (id, pass) => {
        const rndInt = Math.floor(Math.random() * 10) + 1
        pass = bcrypt.hashSync(pass, rndInt)
        const update = await UserModel.updateOne({_id: id}, {"$set": {password: pass}})
        if (!update.modifiedCount)throw new Error("Lỗi update password")
    },
    getSummary: async () => {
        const renters = await UserModel.where('role', 3).count() ;
        const owners = await UserModel.where('role', 2).count();
        const notApproved = await UserModel.where('role', 2).where('state', 1).count();
        const approved = owners - notApproved
        return {
            renters,
            owners,
            approved,
            notApproved
        }
    },
    getAllOwners: async (req) => {
        const query = req.query
        let page, limit
        query.page ?  page= parseInt(query.page)  : page = 1
        query.limit ? limit = parseInt(query.limit) : limit = 10
        query.role = 2
        console.log('query', query)
        const data = await UserModel.find(query).skip((page - 1) * limit).limit(limit).sort({'createdAt': 'desc'})
        return data
    },
    updateState: async (id, state) => {
        const data = await UserModel.updateOne({_id: id}, {state: state})
        return data
    },
    UpsertUser : async (data) =>{
        const existUser = await UserModel.findOne({email : data.email})
        if (existUser) {
            const accessToken = jwt.sign({
                email: existUser.email,
                role: existUser.role,
                id: existUser._id
            }, process.env.JWT_ACCESS_TOKEN , {expiresIn: "1d"})
            const refreshToken = jwt.sign({
                email: existUser.email,
                role: existUser.role,
                id: existUser._id
            }, process.env.JWT_REFRESH_TOKEN, {expiresIn: "7d"})
            return {accessToken, refreshToken}
        }
        //Create new user
        const user = await UserModel.create({
            name: data.name,
            email: data.email,
            role: data.role,
            state: data.role !== constants.owner ? 2 : 1,
            avatar: {
                url: data.picture
            }
        })
        const accessToken = jwt.sign({
            email: data.email,
            role: data.role ? data.role : constants.renter,
            id : user._id
        }, process.env.JWT_ACCESS_TOKEN, {expiresIn: "1d"})
        const refreshToken = jwt.sign({
            email: data.email,
            role: data.role ? data.role : constants.renter,
            id : user._id
        }, process.env.JWT_REFRESH_TOKEN, {expiresIn: "7d"})
        return {accessToken, refreshToken}
    },
    request_pass : async (email) => {
        const user = await UserModel.findOne({email})
        if(!user) throw new Error("Không tìm thấy email")
        if(user.resetToken){
            const payload = jwt.decode(user.resetToken, {complete: true}).payload
            console.log(payload.iat)
            if (payload.iat + 300 > Date.now() /1000){
                throw new Error("Vui lòng chờ 5 phút trước khi request lại")
            }
        }//create Token
        const token = jwt.sign({email}, process.env.JWT_REFRESH_TOKEN,{expiresIn: "5m"})

        //axios send mail
        const axios = require('axios')
        let data = {
            "sender": {
                "name": "Admin thue tro",
                "email": "minhbangod@gmail.com"
            },
            "to": [
                {
                    "email": email,
                    "name": user.name || ""
                }
            ],
            "subject": "Reset password",
            "htmlContent": require('../constants/resetmailTemplate').generateResetMail(user.name, token),
            "headers": {
                "X-Mailin-custom": "custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3",
                "charset": "iso-8859-1"
            }
        }
        var config = {
            method: 'post',
            url: 'https://api.sendinblue.com/v3/smtp/email',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.MAIL_API_KEY,
                'content-type': 'application/json'
            },
            data : data
        };
        await axios(config)
        return UserModel.updateOne({email}, {$set: {resetToken : token}})
    },
    resetPassword :async (token, password) => {
        //verify token
        const decode = jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
        //hass pass
        const rndInt = Math.floor(Math.random() * 10) + 1
        const hashPass = bcrypt.hashSync(password, rndInt)
        return UserModel.updateOne({email : decode.email}, {$set : {password: hashPass}})
    },
    getReport : async (id) =>{
        const postedAcc = await AccomdModel.countDocuments({status: "posted", ownerId : id})
        const likedPost = await AccomdModel.find({ownerId : id, likes: {$gt : 0}}).lean()
        if (likedPost && likedPost.length ){

        }
    },
    getFavorite : async (query) =>{
        let {limit,page,id} = query
        limit ? limit = parseInt(limit) : limit = 10
        page ? page = parseInt(page) : page = 1
        const Accomod = await AccomdModel.find({userLiked : {$elemMatch : {$eq: id}}}).limit(limit).skip((page - 1)* limit)
        return {
            total: Accomod.length,
            page,
            limit,
            data : Accomod
        }
    },
    getStatistic : async (query) =>{
        const data = {
            district: [],
            area: [],
            price: [],
        }
        const districtQuery = [
            {
                '$match': {
                    "status": { $ne: 'draft' }
                }
            },
            {
              '$group': {
                '_id': '$address.district', 
                'count': {
                  '$sum': 1
                }
              }
            }, {
              '$sort': {
                'count': -1
              }
            }, {
              '$limit': 10
            },
          ]
        const districtCount = await AccomdModel.aggregate(districtQuery).exec()
        data.district = districtCount

        const areaGroup1 = await AccomdModel.where({"status": { $ne: 'draft' }}).count({
            area: {
              $gt: 0,
              $lt: 50,
            },
          });
        const areaGroup2 = await AccomdModel.where({"status": { $ne: 'draft' }}).count({
            area: {
              $gte: 50,
              $lt: 100,
            },
        });
        const areaGroup3 = await AccomdModel.where({"status": { $ne: 'draft' }}).count({
            area: {
              $gte: 100,
              $lt: 200,
            },
        });
        const areaGroup4 = await AccomdModel.where({"status": { $ne: 'draft' }}).count({
            area: {
              $gte: 200,
            },
        });
        data.area = [
            areaGroup1,
            areaGroup2,
            areaGroup3,
            areaGroup4
        ]
        
        for(let i = 0; i< 3; i++) {
            let unit = 'month'
            if(i==0) {
                unit = 'month'
                unitNumber = 1
            }
            if(i==1) {
                unit = 'quarter',
                unitNumber = 3
            }
            if(i==2) {
                unit = 'year'
                unitNumber = 12
            }
            const priceGroup1 = await AccomdModel.where({"status": { $ne: 'draft' }}).count({
                'price.quantity': {
                    $gt: 0,
                    $lt: unitNumber * 1000000,
                },
                'price.unit' : unit
                });
            const priceGroup2 = await AccomdModel.where({"status": { $ne: 'draft' }}).count({
                'price.quantity': {
                    $gte: unitNumber * 1000000,
                    $lt: unitNumber * 2000000,
                },
                'price.unit' : unit
            });
            const priceGroup3 = await AccomdModel.where({"status": { $ne: 'draft' }}).count({
                'price.quantity': {
                    $gte: unitNumber * 2000000,
                    $lt: unitNumber * 3000000,
                },
                'price.unit' : unit
            });
            const priceGroup4 = await AccomdModel.where({"status": { $ne: 'draft' }}).count({
                'price.quantity': {
                    $gte: unitNumber * 3000000,
                },
                'price.unit' : unit
            });
            data.price.push([
                    priceGroup1,
                    priceGroup2,
                    priceGroup3,
                    priceGroup4
                ]
            )
        }



        return data
    }
}
module.exports = userService

const buildQuery = payload => {
    const query = {}
    if (payload?.name) {
        query.name = payload.name
    }
    if(payload?.birthDay) {
        let date = new moment(payload.birthDay, "YYYY/MM/DD")
        query.birthDay = date
    }
    if(payload.sex !== undefined)query.sex = payload.sex

    if(payload?.address?.district !== "" && payload?.address?.district ) {
        query["address.district"] = payload?.address?.district
    }
    if(payload?.address?.ward !== "" && payload?.address?.ward) {
        query["address.ward"] = payload?.address?.ward
    }
    if(payload?.address?.detail !== "" && payload?.address?.detail) {
        query["address.detail"] = payload?.address?.detail
    }

    if (payload?.phoneNumber) {
        query.phoneNumber = payload.phoneNumber
    }
    if (payload?.CCCD) {
        query.CCCD = payload.CCCD
    }
    if (payload?.zalo) {
        query.zalo = payload.zalo
    }
    if (payload?.avatar) {
        query.avatar = payload.avatar
    }
    if (payload?.password) {
        const rndInt = Math.floor(Math.random() * 10) + 1
        query.password = bcrypt.hashSync(payload.password, rndInt)
    }
    return {"$set": query}
}
