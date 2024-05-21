const express = require('express');
const { register, login, getOwnProfile, updatePassword, logout } = require('../controller/AuthController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users/me', verifyToken, getOwnProfile);
router.patch('/users/me/password', verifyToken, updatePassword);
router.delete('/logout', logout)

module.exports = router;