
const forumService = require('./forum.service')
const logger = require('../../services/logger.service')



module.exports = {
    getForumSubjects,
    addQusetionToSubject,
    addAnswerToQusetion,
    addOrRemoveLike
}


async function getForumSubjects(req, res) {
    try {
        // const stations = await stationService.query(req.query)
        // console.log(req.params.value)
        // const songs = await searchService.query(req.params.value)
        const subjects = await forumService.query()
        res.send(subjects)
    } catch (err) {
        // logger.error('Cannot get forum subject', err)
        res.status(500).send({ err: 'Failed to get forum subjects' })
    }
}

// async function updateSubject(req, res) {
//     try {
//         const { subject, msg } = req.body
//         await forumService.update(subject)
//     } catch (err) {
//         logger.error('Cannot update forum subject', err)
//         res.status(500).send({ err: 'Failed to update forum subjects' })
//     }
// }


async function addQusetionToSubject(req, res) {
    try {
        const { question, cluster, subject } = req.body
        const clusterToReturn =  await forumService.addQuestion(question, cluster, subject)
        res.send(clusterToReturn)
    } catch (err) {
        logger.error('Cannot add question to subject', err)
        res.status(500).send({ err: 'Failed to update forum subjects' })
    }
}

async function addAnswerToQusetion(req, res) {
    try {
        const { ans, msg, cluster, subject } = req.body
        const objToReturn = await forumService.addAnswer(ans, msg, cluster, subject)
        res.send(objToReturn)
    } catch (err) {
        logger.error('Cannot add answer to question', err)
        res.status(500).send({ err: 'Failed to add answer' })
    }
}

async function addOrRemoveLike(req, res) {
    try {
        const { ans, question, cluster, subject } = req.body
        const objToReturn = await forumService.likeChange(ans, question, cluster, subject)
        // res.send(objToReturn)
    } catch (err) {
        logger.error('Cannot update forum subject', err)
        res.status(500).send({ err: 'Failed to add like' })
    }
}