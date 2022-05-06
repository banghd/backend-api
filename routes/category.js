const router = require('express').Router()
const cateGoryCtrl = require('../controllers/categoryController')
const {auth, authAdmin} = require("../middlewares/authentication")

router.get("/", cateGoryCtrl.getList)
router.post("/:id",auth, authAdmin, cateGoryCtrl.create)
router.delete("/:id", auth,authAdmin, cateGoryCtrl.delete)
router.put("/:id",auth, authAdmin, cateGoryCtrl.update)
//router.get("/:id", cateGoryCtrl.find)

module.exports = router