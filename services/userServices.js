const UserModel = require('../models/user')
const userService = {
    getdata: () => {
        return UserModel.find({})
    }
}
module.exports = userService