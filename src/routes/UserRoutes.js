const express = require('express');
const { register, login, getOwnProfile, getAllUser, updateUser, deleteUser } = require('../controller/UserController');
const { isAuthorized } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users/me', isAuthorized, getOwnProfile);
router.get('/users', isAuthorized, getAllUser);
router.patch('/users/:id', isAuthorized, updateUser);
router.delete('/users/:id', isAuthorized, deleteUser);

module.exports = router;