const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { createFeedback } = require('../controller/FeedbackController');

const router = express.Router();

router.post('/tours/:id/feedback', verifyToken, createFeedback);

module.exports = router;