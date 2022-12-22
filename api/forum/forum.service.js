const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const utilService = require('../../services/util.service')


module.exports = {
    query,
    addQuestion,
    addAnswer,
    likeChange
}



async function query(value) {
    try {
        let collection = await dbService.getCollection('forum')
        var subjects = await collection.find().toArray()
        // let songsToReturn = songs.filter(song => {
        // if (song.snippet.title.toLowerCase().includes(value.toLowerCase())) return song
        // })
        // console.log(subjects);
        return subjects
    } catch (err) {
        console.log(err);
        // logger.error('cannot find reviews', err)
        throw err
    }
}

// async function update(subject) {
//     try {
//         let collection = await dbService.getCollection('forum')
//         // var subjects = await collection.find().toArray()
//         await collection.updateOne(
//             { _id: ObjectId(subject._id) },
//             { $set: { cluster: subject.cluster } },
//         )
//     } catch (err) {
//         logger.error('cannot add msgs', err)
//         throw err
//     }
// }

async function addQuestion(question, cluster, subject) {
    try {
        let collection = await dbService.getCollection('forum')
        // var subjects = await collection.find().toArray()
        let questionToAdd = { ...question, _id: utilService.makeId() }
        // let clusterMsgsToAdd = [...cluster.msgs, questionToAdd]
        cluster.msgs.unshift(questionToAdd)
        // console.log(cluster, 'check');
        await collection.updateOne(
            { _id: ObjectId(subject._id) },
            {
                $set: {
                    "cluster.$[elemX].msgs": cluster.msgs
                }
            },
            {
                "arrayFilters": [
                    {
                        "elemX._id": ObjectId(cluster._id)
                    }
                ]
            }
            // { _id: ObjectId(cluster._id) },
            // { $set: { cluster: cluster } },
        )
        console.log('finish');
        return cluster
    } catch (err) {
        // logger.error('cannot add msgs', err)
        throw err
    }
}


async function addAnswer(ans, question, cluster, subject) {
    try {
        let collection = await dbService.getCollection('forum')
        // var subjects = await collection.find().toArray()
        answerToAdd = { ...ans, _id: utilService.makeId() }
        // console.log(answerToAdd);
        question.ans.push(answerToAdd)
        let msgsToReturn = cluster.msgs.map(q => {
            if (q._id === question._id) return question
            else return q
        })
        collection.updateOne(
            { _id: ObjectId(subject._id) },
            {
                $set: {
                    "cluster.$[elemX].msgs.$[elemY].ans": question.ans
                    // "cluster.$[elemX].msgs": question.ans
                }
            },
            {
                "arrayFilters": [
                    {
                        "elemX._id": ObjectId(cluster._id),
                    },
                    {
                        "elemY._id": question._id
                    }
                ]
            }
            // { _id: ObjectId(cluster._id) },
            // { $set: { cluster: cluster } },
        )
        console.log('finish adding anwer');
        return { question, msgsToReturn }
    } catch (err) {
        logger.error('cannot add ans', err)
        throw err
    }
}

async function likeChange(ans, question, cluster, subject) {
    try {
        let collection = await dbService.getCollection('forum')
        var subjects = await collection.find().toArray()
        collection.updateOne(
            { _id: ObjectId(subject._id) },
            {
                $set: {
                    "cluster.$[elemX].msgs.$[elemY].ans.$[elemZ].likes": ans.likes
                    // "cluster.$[elemX].msgs": question.ans
                }
            },
            {
                "arrayFilters": [
                    {
                        "elemX._id": ObjectId(cluster._id),
                    },
                    {
                        "elemY._id": question._id
                    },
                    {
                        "elemZ._id": ans._id
                    }
                ]
            })
        console.log('finish');
    } catch (err) {
        logger.error('cannot add msgs', err)
        throw err
    }
}