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
    }
}

module.exports = UserControllers
