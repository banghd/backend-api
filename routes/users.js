const router = require('express').Router()
const userCtrl = require('../controllers/userControllers')
const {validateSignIn, validateLogIn , validateUser} = require('../middlewares/validate')
const {auth, authAdmin} = require("../middlewares/authentication")
router.get("/:id",auth , userCtrl.getdata)
router.get("/:id/report", auth, userCtrl.getdataReport)
router.post("/sign-in", validateSignIn, userCtrl.createUser)
router.post("/log-in", validateLogIn, userCtrl.logIn)
router.get("/token/refresh-token", userCtrl.refreshToken)
router.put('/update',auth, validateUser, userCtrl.updateUser)
router.post("/update-password", auth, userCtrl.updatePass)
router.get("/manage/summary", auth, authAdmin, userCtrl.getSummary)
router.get("/manage/owners", auth, authAdmin, userCtrl.getAllOwners)
router.put('/manage/update-state/:id', auth, authAdmin, userCtrl.updateState)
router.post('/google/login', userCtrl.logInGG)
router.post("/request-password", userCtrl.request_password)
router.post("/reset-password", userCtrl.resetPassword)
router.get("/favorite/accomod", auth, userCtrl.getFavorite)
router.get("/manage/statistic", auth,authAdmin, userCtrl.getStatistic)

//router.post('/getListUser', auth, authAdmin, userCtrl.getListUser)
module.exports = router