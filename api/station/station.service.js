const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
// const asyncLocalStorage = require('../../services/als.service')
const userService = require('../user/user.service')

module.exports = {
    query,
    getById,
    add,
    loadUserStations,
    addSong,
    remove,
    update
}
async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        let collectionStation = await dbService.getCollection('stations')
        // let collectionSongs = await dbService.getCollection('songs')

        var stations = await collectionStation.find().toArray()
        // var songs = await collectionSongs.find().toArray()
        // console.log(stations);
        // console.log(songs);

        // let songsToReturn = []
        // stations.forEach(station => {
        //     station.songsId.forEach(id => {
        //         songs.forEach(song => {
        //             // console.log(song);
        //             if (song._id == id) songsToReturn.push(song)
        //         });
        //     })
        // })

        // console.log(songsToReturn);


        // collectionStation.map(station => {
        //     station.songsId.forEach(async songId => {
        //         await collectionSongs.aggregate([
        //             {
        //                 $lookup:
        //                 {
        //                     from: 'songs',
        //                     localField: 'songsId',
        //                     foreignField: '_id',
        //                     as: 'songs'
        //                 }
        //             }
        //         ]).toArray()

        //     });

        // });


        // var station = await collection.aggregate([
        // {
        // $match: {
        //     songsId: {
        //         $in: {
        //             $lookup:
        //             {
        //                 from: 'songs',
        //                 localField: 'songsId',
        //                 foreignField: '_id',
        //                 as: 'songs'
        //             }
        //         }

        //     }
        // }
        // },
        // {
        //     $lookup:
        //     {
        //         localField: 'byUserId',
        //         from: 'user',
        //         foreignField: '_id',
        //         as: 'byUser'
        //     }
        // },
        // {
        // $unwind: '$byUser'
        // },
        // {
        //     $lookup:
        //     {
        //         localField: 'aboutUserId',
        //         from: 'user',
        //         foreignField: '_id',
        //         as: 'aboutUser'
        //     }
        // },
        // {
        //     $unwind: '$songsId'
        // },
        // {
        //     $lookup:
        //     {
        //         from: 'songs',
        //         localField: 'songsId.songId',
        //         foreignField: '_id',
        //         as: 'songs'
        //     }
        // },
        // {
        //     $unwind: '$byUser'
        // },
        // {
        //     $lookup:
        //     {
        //         localField: 'aboutUserId',
        //         from: 'user',
        //         foreignField: '_id',
        //         as: 'aboutUser'
        //     }
        // },
        // {
        //     $unwind: '$aboutUser'
        // }
        // ]).toArray()
        // console.log(station, 'station service agg');

        // collection = collection.map(review => {
        //     review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
        //     review.aboutUser = { _id: review.aboutUser._id, fullname: review.aboutUser.fullname }
        //     delete review.byUserId
        //     delete review.aboutUserId
        //     return review
        // })

        return stations
    } catch (err) {
        console.log(err);
        // logger.error('cannot find reviews', err)
        throw err
    }

}


async function loadUserStations(stationsId) {
    try {
        stationsId.map(id => getById(id))
    } catch (err) {
        logger.error(`cannot load user stations`, err)
        throw err
    }
}

async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('stations')
        const station = await collection.findOne({ _id: ObjectId(stationId) })
        return station
    } catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function add(station) {
    try {
        const stationToAdd = station
        const collection = await dbService.getCollection('stations')
        await collection.insertOne(stationToAdd)
        return stationToAdd
    } catch (err) {
        logger.error('cannot insert station')
        throw err
    }
}

async function addSong(station) {
    // const collection = await dbService.getCollection('stations')
    // await collection.updateOne(
    //     { _id: ObjectId(station._id) },
    //     { $set: { songs: station.songs } },
    //     { $set :{duration: station.duration}}
    // )
    update(station)
    return station
}

async function update(station, loggedinUser = null) {
    if (station.name === "Liked Songs") {
        const updatedUser = { ...loggedinUser, likedSongs: station.songs }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: loggedinUser._id }, { $set: updatedUser })
        return updatedUser
    }
    else {
        const stationToSave = {
            _id: ObjectId(station._id),
            name: station.name,
            songs: station.songs,
            stationImg: station.stationImg,
            duration: station.duration,
            renderType: station.renderType
        }
        const collection = await dbService.getCollection('stations')
        await collection.updateOne({ _id: stationToSave._id }, { $set: stationToSave })
        // await collection.updateOne(
        //     { _id: ObjectId(station._id) },
        //     { $set: { songs: station.songs } }
        // )
        return station
    }
}

async function remove(stationId, loggedinUser) {
    try {
        const station = await getById(stationId)
        if (station.createdBy == loggedinUser._id) {
            const collection = await dbService.getCollection('stations')
            await collection.deleteOne({ _id: ObjectId(stationId) })
        }
        let newStations = loggedinUser.stations.filter(station => station != stationId)
        const updatedUser = { ...loggedinUser, stations: newStations }
        const userToReturn = await userService.update(updatedUser)
        return userToReturn
    } catch (err) {
        logger.error('cannot delete station')
        // throw err
    }

}

// async function remove(reviewId) {
//     try {
//         const store = asyncLocalStorage.getStore()
//         const { loggedinUser } = store
//         const collection = await dbService.getCollection('review')
//         // remove only if user is owner/admin
//         const criteria = { _id: ObjectId(reviewId) }
//         if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
//         const {deletedCount} = await collection.deleteOne(criteria)
//         return deletedCount
//     } catch (err) {
//         logger.error(`cannot remove review ${reviewId}`, err)
//         throw err
//     }
// }


function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy._id) criteria._id = ObjectId(filterBy._id)
    return criteria
}