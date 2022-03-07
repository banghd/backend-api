const router = require('express').Router()
const userCtrl = require('../controllers/userControllers')
router.get("/", userCtrl.getdata)

module.exports = router