const router = require('express').Router()
const accomodationController = require('../controllers/accomodationControllers')
const { auth, authAdmin } = require("../middlewares/authentication")
const { validateAccomodation, validateDeleteMultipleAccod } = require('../middlewares/validate')
router.get('/', auth, accomodationController.getAccomodations)
router.get('/:id', accomodationController.getdata)
router.post('/', auth, validateAccomodation, accomodationController.createAccomodation)
router.put('/:id', auth, validateAccomodation, accomodationController.updateAccomodation)
router.delete('/:id', auth, accomodationController.deleteAccomodation)
router.put('/update-state/:id', auth, accomodationController.updateRentedStatus)
router.get('/user/accomod',auth, accomodationController.getUserListAccomod )
router.post('/delete-multiple', auth, validateDeleteMultipleAccod, accomodationController.deleteMultiple )
router.get('/renter/list', accomodationController.getListRenter)
router.post('/increase-like/:id', auth, accomodationController.increaseLikes)
router.delete('/decrease-like/:id', auth, accomodationController.decreaseLikes)
router.post('/increase-view/:id', accomodationController.increseViews)
router.get('/manage/summary', auth, authAdmin, accomodationController.getSummary)
router.get('/manage/posts', auth, authAdmin, accomodationController.getAllPosts)
router.get('/payment/:id', auth, accomodationController.payAcc)
router.put('/manage/update-state/:id', auth, authAdmin, accomodationController.updateState)

module.exports = router
