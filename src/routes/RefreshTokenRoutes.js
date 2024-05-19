const express = require('express');
const refreshToken = require('../controller/refreshTokenController');

const router = express.Router();

router.get('/token', refreshToken);

module.exports = router;