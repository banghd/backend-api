const userService = require('../services/userServices')

const UserControllers = {
    getdata: async (req, res) => {
        try {
            const {id} = req.params
            if (!id) return res.status(400).json({message: "please provide id"})
            const data = await userService.getdata(id)
            return res.json(data)
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }

    },
    createUser: async (req, res) => {
        try {
            const {accessToken, refreshToken} = await userService.createUser(req.body)
            return res.status(200).json({
                data: {accessToken, refreshToken},
                message: "Create user successfully"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    logIn: async (req, res) => {
        try {
            const {accessToken, refreshToken} = await userService.logIn(req.body)
            return res.status(200).json({
                data: {accessToken, refreshToken},
                message: "Login successfully"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    refreshToken: async (req, res) => {
        try {
            const {refreshToken} = req.query
            const accessToken = await userService.GetRefreshToken(refreshToken)
            return res.status(200).json({
                accessToken,
                message: "refresh token succesfully"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    updateUser : async (req, res) => {
        try {
            let data = await userService.updateUser(req.body)
            return res.status(200).json({
                message: "update user successfully",
                data
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    updatePass: async (req, res) => {
        try {
            const {id, password} = req.body
            if (!id || !password) return res.status(400).json({
                message: "thiếu id hoặc password"
            })
            if (!/^[a-zA-Z0-9]{3,30}$/.test(password)) return res.status(400).json({
                message: "password không hợp lệ"
            })
            await userService.updatePass(id, password)
            return res.status(200).json({
                message: "Cập nhật mật khẩu thành công"
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    getSummary: async (req, res) => {
        console.log('herr')
        try {
            const result = await userService.getSummary()
            console.log('result', result)
            return res.status(200).json({
                message: "Success",
                data: result
            })
        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    getAllOwners: async (req, res) => {
        try {
            const result = await userService.getAllOwners(req)
            return res.status(200).json({
                message: "Success",
                data: result
            })
        } catch (error) {
            return res.status(400).json({
                message: e.message
            })
        }
    },
    logInGG : async (req, res) => {
        try {
            const {token, role} = req.body
            if (!token) return res.status(400).json({
                message: "invalid token"
            })
            const { OAuth2Client } = require('google-auth-library')
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            })

            const { name, email, picture } = ticket.getPayload()
            let data = { name, email, picture, role }

            let {accessToken, resetToken }= await userService.UpsertUser(data)
            return res.json({data : {accessToken, resetToken}, message: "Log in via google thành công"})

        } catch (e) {
            return res.status(400).json({
                message: e.message
            })
        }
    }
}

module.exports = UserControllers
