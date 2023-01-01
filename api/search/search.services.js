const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')


module.exports = {
    query,
    getById,
    add,
    update
}



async function query(value) {
    try {
        let collection = await dbService.getCollection('songs')
        var songs = await collection.find().toArray()
        let songsToReturn = songs.filter(song => {
            if (song.snippet.title.toLowerCase().includes(value.toLowerCase())) return song
        })
        console.log(songsToReturn);
        return songsToReturn
    } catch (err) {
        console.log(err);
        // logger.error('cannot find reviews', err)
        throw err
    }
}

async function getById(videoId){
    try {
        const collection = await dbService.getCollection('songs')
        const song = await collection.findOne({ videoId: videoId })
        return song
    } catch (err) {
        logger.error(`while finding song with videoId ${videoId}`, err)
        throw err
    }
}

async function add(song) {
    try {
        const collection = await dbService.getCollection('songs')
        var songs = await collection.find().toArray()
        isInMellofy = !!songs.find(songFromArr => songFromArr.videoId === song.videoId)
        if(!isInMellofy) await collection.insertOne(song)
        // return songToAdd
    } catch (err) {
        logger.error('cannot insert station')
        throw err
    }
}

async function update(song){
    try{
        const songToSave = {
            ...song,
            videoId:song.videoId,
            snippet:song.snippet,
            duration:song.duration
        }
        console.log(songToSave , 'service');
        const collection = await dbService.getCollection('songs')
        await collection.updateOne({ videoId: songToSave.videoId }, { $set: songToSave })
        return songToSave
    } catch (err) {
        logger.error('cannot insert song')
        throw err
    }
}