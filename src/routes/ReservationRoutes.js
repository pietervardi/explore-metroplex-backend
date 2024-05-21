const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { createReservation, getReservations, cancelReservation } = require('../controller/ReservationController');

const router = express.Router();

router.post('/tours/:id/reservations', verifyToken, createReservation);
router.get('/reservations', verifyToken, getReservations);
router.patch('/reservations/:id/cancel', verifyToken, cancelReservation);

module.exports = router;