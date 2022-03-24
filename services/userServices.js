const UserModel = require('../models/user')
const bcrypt = require("bcrypt")
const constants = require("../constants/roles")
const jwt = require('jsonwebtoken')
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
            isApproved: data.role === constants.owner ? false : true
        })
        const accessToken = jwt.sign({
            email: data.email,
            role: data.role ? data.role : constants.renter,
            id : user._id
        }, process.env.JWT_ACCESS_TOKEN, {expiresIn: "5m"})
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
        }, process.env.JWT_ACCESS_TOKEN , {expiresIn: "5m"})
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
            }, process.env.JWT_ACCESS_TOKEN, {expiresIn: "5m"})
        } catch (e){
            console.log(e.message)
            throw new Error(e.message)
        }
    }
}
module.exports = userService