const router = require('express').Router()
const userCtrl = require('../controllers/userControllers')
const {validateSignIn, validateLogIn , validateUser} = require('../middlewares/validate')
const {auth, authAdmin} = require("../middlewares/authentication")
router.get("/:id",auth , userCtrl.getdata)
router.post("/sign-in", validateSignIn, userCtrl.createUser)
router.post("/log-in", validateLogIn, userCtrl.logIn)
router.get("/token/refresh-token", userCtrl.refreshToken)
router.put('/update',auth, validateUser, userCtrl.updateUser)
router.post("/update-password", auth, userCtrl.updatePass)
router.get('/getListUser/owner', auth, authAdmin, userCtrl.getListUser)
router.get('/approve/:id', auth, authAdmin, userCtrl.approvedAccomod)
router.post("/approve-multi", auth, authAdmin, userCtrl.approvedAccomodMulti)
module.exports = router