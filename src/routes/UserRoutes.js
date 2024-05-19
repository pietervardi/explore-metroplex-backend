const express = require('express');
const { getAllUser, updateUser, deleteUser } = require('../controller/UserController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/users', verifyToken, getAllUser);
router.patch('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, deleteUser);

module.exports = router;