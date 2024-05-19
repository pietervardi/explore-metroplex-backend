const express = require('express');
const { getAllTour, getTourById, createTour, updateTour, deleteTour } = require('../controller/TourController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/tours', getAllTour);
router.get('/tours/:id', getTourById);
router.post('/tours', verifyToken, createTour);
router.patch('/tours/:id', verifyToken, updateTour);
router.delete('/tours/:id', verifyToken, deleteTour);

module.exports = router;