const userService = require('../services/userServices')

const UserControllers = {
    getdata: async (req, res) => {
        const data = await  userService.getdata()
        res.json(data)
    }
}

module.exports = UserControllers