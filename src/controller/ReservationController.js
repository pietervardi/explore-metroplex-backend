const validator = require('validator');
const prisma = require('../db');

const createReservation = async (req, res) => {
  try {
    const userId = req.userData.id;
    const tourId = req.params.id;

    const tour = await prisma.tour.findUnique({
      where: {
        id: tourId
      }
    });

    if (!tour) {
      return res.status(409).json({
        status: 'fail',
        message: 'tour not exist'
      }); 
    }

    const {
      name,
      phone,
      email,
      ticket,
      subtotal,
      reservedAt,
    } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: 'fail',
        message: 'invalid email format'
      });
    }

    const reservedDate = new Date(reservedAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservedDate < today) {
      return res.status(400).json({
        status: 'fail',
        message: 'cannot make a reservation for a past date'
      });
    }

    reservedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(reservedDate);
    nextDay.setDate(reservedDate.getDate() + 1);

    const totalTicketsReserved = await prisma.reservation.aggregate({
      _sum: {
        ticket: true
      },
      where: {
        tourId: tourId,
        reservedAt: {
          gte: reservedDate,
          lt: nextDay
        },
        status: {
          not: 'CANCELED'
        }
      }
    });

    const ticketsAlreadyReserved = totalTicketsReserved._sum.ticket || 0;
    if (ticketsAlreadyReserved + ticket > tour.capacity) {
      return res.status(409).json({
        status: 'fail',
        message: 'reservation exceeds tour capacity for the selected date'
      });
    }

    await prisma.reservation.create({
      data: {
        name,
        phone,
        email,
        ticket,
        subtotal,
        reservedAt: reservedDate,
        userId,
        tourId,
      },
    });

    await prisma.tour.update({
      where: {
        id: tourId
      },
      data: {
        visitor: {
          increment: ticket
        }
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'reservation created',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getReservations = async (req, res) => {
  try {
    const { status } = req.query;
    const currentUserId = req.userData.id;
    const isAdmin = req.userData.role === 'ADMIN';

    const whereClause = isAdmin ? {} : { userId: currentUserId };
    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        ticket: true,
        subtotal: true,
        reservedAt: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profilePicture: true,
            role: true,
          }
        },
        tour: {
          select: {
            id: true,
            name: true,
            city: true,
            price: true,
            description: true,
            address: true,
            map: true,
            photo: true,
          }
        },
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    const now = new Date();
    const updatedReservations = await Promise.all(
      reservations.map(async (reservation) => {
        if (reservation.status === 'BOOKED' && new Date(reservation.reservedAt) < now) {
          return prisma.reservation.update({
            where: {
              id: reservation.id
            },
            data: {
              status: 'DONE'
            }
          });
        }
        return reservation;
      })
    );

    res.status(200).json({
      status: 'success',
      message: 'reservation retrieved',
      data: {
        reservations: updatedReservations
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const cancelReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const currentUserId = req.userData.id;
    const isAdmin = req.userData.role === 'ADMIN';

    const isTourExist = await prisma.reservation.findUnique({
      where: {
        id: reservationId
      }
    });

    if (!isTourExist) {
      return res.status(409).json({
        status: 'fail',
        message: 'reservation not exist'
      }); 
    }

    if (!isAdmin && isTourExist.userId !== currentUserId) {
      return res.status(403).json({
        status: 'fail',
        message: 'unauthorized to cancel this reservation',
      });
    }

    await prisma.reservation.update({
      where: {
        id: reservationId
      },
      data: {
        status: 'CANCELED'
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'reservation canceled',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReservation, getReservations, cancelReservation };