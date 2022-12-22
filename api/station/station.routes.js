const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
// const {addReview, getReviews, deleteReview} = require('./review.controller')
const router = express.Router()
const {getStations, getStation, getUserStations, createStation,addSongToStation, updateStation, deleteStation} = require('./station.controller')


// middleware that is specific to this router
// router.use(requireAuth)

// router.get('/', log, getReviews)
// router.post('/',  log, requireAuth, addReview)
// router.delete('/:id',  requireAuth, deleteReview)



router.get('/', getStations)
router.get('/', getUserStations)
router.get('/:id', getStation)
router.post('/', createStation)
router.post('/:id', addSongToStation) 
router.put('/', updateStation) 
router.delete('/:id',  requireAuth, deleteStation)

module.exports = router