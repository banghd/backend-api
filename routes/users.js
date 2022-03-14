const router = require('express').Router()
const userCtrl = require('../controllers/userControllers')
const {validateSignIn, validateLogIn} = require('../middlewares/validate')
const {auth} = require("../middlewares/authentication")
router.get("/:id",auth , userCtrl.getdata)
router.post("/sign-in", validateSignIn, userCtrl.createUser)
router.post("/log-in", validateLogIn, userCtrl.logIn)
//router.post("/refresh-token", userCtrl.refreshToken)
module.exports = router