const express = require('express');
const { getAllUser, updateUser, deleteUser } = require('../controller/UserController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.get('/users', verifyToken, isAdmin, getAllUser);
router.patch('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, deleteUser);

module.exports = router;