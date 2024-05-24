const express = require('express');
const multer = require('multer');
const { getAllTour, getTourById, createTour, updateTour, deleteTour } = require('../controller/TourController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/tours', getAllTour);
router.get('/tours/:id', getTourById);
router.post('/tours', verifyToken, isAdmin, upload.single('image'), createTour);
router.patch('/tours/:id', verifyToken, isAdmin, upload.single('image'), updateTour);
router.delete('/tours/:id', verifyToken, isAdmin, deleteTour);

module.exports = router;