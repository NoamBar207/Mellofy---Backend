const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
// const {log} = require('../../middlewares/logger.middleware')
// const {addReview, getReviews, deleteReview} = require('./review.controller')
const router = express.Router()
// const {getStations, getStation, getUserStations, createStation} = require('./station.controller')
const { search, addSongFromSearch, updateSong, getSong } = require('./search.controller')


// middleware that is specific to this router
// router.use(requireAuth)

// router.get('/', log, getReviews)
// router.post('/',  log, requireAuth, addReview)
// router.delete('/:id',  requireAuth, deleteReview)



router.get('/:value', search)
router.get('/videoId/:videoId', getSong)
// router.get('/', getUserStations)
// router.get('/:id', getStation)
router.post('/', addSongFromSearch )
router.put('/', updateSong )
// router.delete('/:id',  requireAuth, deleteReview)

module.exports = router