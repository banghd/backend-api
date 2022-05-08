const router = require('express').Router()
const PFCtrler = require('../controllers/PFcontroller')
const {auth, authAdmin} = require("../middlewares/authentication")

router.get("/",auth, PFCtrler.getList)
router.post("/",auth, PFCtrler.create)
router.delete("/:id", auth, PFCtrler.delete)
router.put("/:id",auth, PFCtrler.update)
//router.get("/:id", PFCtrler.find)

module.exports = router