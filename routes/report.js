const router = require('express').Router()
const reportCtrl = require('../controllers/ReportController')
const {auth, authAdmin} = require("../middlewares/authentication")

router.post('/comment', auth , reportCtrl.createComment)

module.exports = router