const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const commentController = require('../controllers/comment.controller')

const router = express.Router();

router.post('/:videoId',authMiddleware.authUserMiddleware,commentController.createComment);

router.get('/',authMiddleware.authUserMiddleware,commentController.allComments);

module.exports = router;