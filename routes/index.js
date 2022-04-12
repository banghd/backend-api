const router = require('express').Router()

router.get("/", (req,res) => {
    res.send("This is backend service!")
})
router.use('/user', require('./users'))
router.use('/file', require('./upload'))
router.use('/accomodations', require('./accomodation'))
router.use('/report', require('./report'))
router.use("/payment", require('./payment'))
router.use("*", (req,res) => {
    res.redirect("/")
})
module.exports = router