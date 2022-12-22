const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
// const stationService = require('./review.service')
const stationService = require('./station.service')
const dbService = require('../../services/db.service')


module.exports = {
    getStations,
    getUserStations,
    getStation,
    createStation,
    addSongToStation,
    updateStation,
    deleteStation
}


async function getStations(req, res) {
    try {
        const stations = await stationService.query(req.query)
        res.send(stations)
    } catch (err) {
        logger.error('Cannot get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}

async function getUserStations(req, res) {
    try {
        const stations = await stationService.loadUserStations(req.query)
        res.send(stations)
    } catch (err) {
        logger.error('Cannot get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}

async function getStation(req, res) {
    try {
        const station = await stationService.getById(req.params.id)
        res.send(station)
    } catch (err) {
        logger.error('Failed to get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}

async function createStation(req, res) {
    var loggedinUser = await authService.validateToken(req.cookies.loginToken)

    try {
        let stationToAdd = req.body
        stationToAdd = await stationService.add(stationToAdd)
        loggedinUser.stations.push(stationToAdd._id)
        loggedinUser = await userService.update(loggedinUser)
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)
        res.send(loggedinUser)


        // const collection = await dbService.getCollection('stations')
        // let returnFromMongo = await collection.insertOne(stationToAdd)
        // console.log(returnFromMongo.ops[0]._id);
        // user.stations.push(returnFromMongo.ops[0]._id)
        // let updatedUser = await userService.update(user)
        // console.log(updatedUser);
    } catch (err) {
        logger.error('Failed to post station', err)
        res.status(500).send({ err: 'Failed to post station' })
    }
}

async function addSongToStation(req, res) {
    try {
        let station = req.body
        const stationReturn = await stationService.addSong(station)
        res.send(stationReturn)
    } catch (err) {
        logger.error('Failed to post song to station', err)
        res.status(500).send({ err: 'Failed to post song to station' })
    }
}

async function updateStation(req, res) {
    var loggedinUser = await authService.validateToken(req.cookies.loginToken)
    try {
        let station = req.body
        const returnEntatiy = await stationService.update(station, loggedinUser)
        res.send(returnEntatiy)
    } catch (err) {
        logger.error('Failed to update station', err)
        res.status(500).send({ err: 'Failed to update to station' })
    }
}

async function deleteStation(req, res) {
    var loggedinUser = await authService.validateToken(req.cookies.loginToken)
    try{
        const updatedUser = await stationService.remove(req.params.id,loggedinUser)
        res.send(updatedUser)
    }catch {
        logger.error('Failed to delete station')
        res.status(500).send({ err: 'Failed to delete to station' })
    }
}