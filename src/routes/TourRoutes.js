const express = require('express');
const { getAllTour, getTourById, createTour, updateTour, deleteTour } = require('../controller/TourController');

const router = express.Router();

router.get('/tours', getAllTour);
router.get('/tours/:id', getTourById);
router.post('/tours', createTour);
router.patch('/tours/:id', updateTour);
router.delete('/tours/:id', deleteTour);

module.exports = router;