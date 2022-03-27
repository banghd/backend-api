const router = require('express').Router()
const accomodationController = require('../controllers/accomodationControllers')
const { auth } = require("../middlewares/authentication")
const { validateAccomodation } = require('../middlewares/validate')
router.get('/:id', auth, accomodationController.getdata)
router.post('/create', auth, validateAccomodation, accomodationController.createAccomodation)
router.put('/update/:id', auth, validateAccomodation, accomodationController.updateAccomodation)
router.delete('/delete/:id', auth, accomodationController.deleteAccomodation)
module.exports = router