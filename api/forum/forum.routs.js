const express = require('express')
const router = express.Router()
const { getForumSubjects, updateSubject, addQusetionToSubject, addAnswerToQusetion, addOrRemoveLike } = require('./forum.controller')


router.get('/', getForumSubjects)
// router.put('/', updateSubject)
router.put('/question', addQusetionToSubject)
router.put('/answer', addAnswerToQusetion)
router.put('/like' ,addOrRemoveLike)

module.exports = router