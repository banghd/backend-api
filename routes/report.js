const router = require('express').Router()
const reportCtrl = require('../controllers/ReportController')
const {auth, authAdmin} = require("../middlewares/authentication")

router.post('/comment', auth , reportCtrl.createComment)
router.get('/comment/:id', auth , reportCtrl.listComment)
router.post('/', auth, reportCtrl.createReport)

module.exports = router