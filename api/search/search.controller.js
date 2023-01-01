const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const searchService = require('./search.services')
const dbService = require('../../services/db.service')


module.exports = {
    search,
    getSong,
    addSongFromSearch,
    updateSong
}


async function search(req, res) {
    try {
        // const stations = await stationService.query(req.query)
        const songs = await searchService.query(req.params.value)
        res.send(songs)
    } catch (err) {
        logger.error('Cannot get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}

async function getSong(req, res) {
    try {
        console.log(req.params.videoId);
        const song = await searchService.getById(req.params.videoId)
        res.send(song)
    } catch (err) {
        logger.error('Failed to get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}


async function addSongFromSearch(req,res){
    try{
        let song = req.body
        await searchService.add(song)
    }catch (err) {
        logger.error('cannot post song', err)
        res.status(500).send({ err: 'Failed to add song' })
    }
}


async function updateSong(req,res){
    try {
        let song = req.body
        const returnedSong = await searchService.update(song)
        res.send(returnedSong)
    }catch (err) {
        logger.error('cannot put song', err)
        res.status(500).send({ err: 'Failed to update song' })

    }
}
// async function getStations(req, res) {
//     try {
//         const stations = await stationService.query(req.query)
//         res.send(stations)
//     } catch (err) {
//         logger.error('Cannot get station', err)
//         res.status(500).send({ err: 'Failed to get station' })
//     }
// }