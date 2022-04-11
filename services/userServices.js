const UserModel = require('../models/user')
const bcrypt = require("bcrypt")
const constants = require("../constants/roles")
const jwt = require('jsonwebtoken')
const moment = require('moment')

const {isString} = require("mocha/lib/utils");
const userService = {
    getdata: async (id) => {
        const data = await UserModel.findOne({_id: id}).select("-password")
        if (!data) {
            throw new Error("Cannot find user")
        }
        return data
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
            isApproved: data.role !== constants.owner
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
