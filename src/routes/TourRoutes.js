const express = require('express');
const { getAllTour, getTourById, createTour, updateTour, deleteTour } = require('../controller/TourController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.get('/tours', getAllTour);
router.get('/tours/:id', getTourById);
router.post('/tours', verifyToken, isAdmin, createTour);
router.patch('/tours/:id', verifyToken, isAdmin, updateTour);
router.delete('/tours/:id', verifyToken, isAdmin, deleteTour);

module.exports = router;