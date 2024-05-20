const express = require('express');
const { register, login, getOwnProfile, logout } = require('../controller/AuthController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users/me', verifyToken, getOwnProfile);
router.get('/users/me/password', verifyToken, getOwnProfile);
router.delete('/logout', logout)

module.exports = router;