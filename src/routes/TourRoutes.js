const express = require('express');
const { getAllTour, getTourById, createTour, updateTour, deleteTour } = require('../controller/TourController');
const { isAuthorized } = require('../middleware/auth');

const router = express.Router();

router.get('/tours', getAllTour);
router.get('/tours/:id', getTourById);
router.post('/tours', isAuthorized, createTour);
router.patch('/tours/:id', isAuthorized, updateTour);
router.delete('/tours/:id', isAuthorized, deleteTour);

module.exports = router;