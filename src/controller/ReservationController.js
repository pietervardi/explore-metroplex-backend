const validator = require('validator');
const prisma = require('../db');
const { getObjectSignedUrl } = require('../services/S3');

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
    const availableTickets = tour.capacity - ticketsAlreadyReserved;

    if (ticket > availableTickets) {
      return res.status(409).json({
        status: 'fail',
        message: availableTickets > 0 ? 
          `only ${availableTickets} tickets are available for the selected date` : 
          'the selected date is fully booked'
      });
    }

    await prisma.reservation.create({
      data: {
        name,
        phone,
        email,
        ticket: parseInt(ticket),
        subtotal: parseInt(subtotal),
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
          increment: parseInt(ticket)
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
    const { status, query } = req.query;
    const currentUserId = req.userData.id;
    const isAdmin = req.userData.role === 'ADMIN';

    const whereClause = isAdmin ? {} : { userId: currentUserId };

    if (status) whereClause.status = status.toUpperCase();

    const reservations = await prisma.reservation.findMany({
      where: {
        ...whereClause,
        ...(query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { user: { name: { contains: query, mode: "insensitive" } } },
            { tour: { name: { contains: query, mode: "insensitive" } } }
          ],
        }),
      },
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
        reservedAt: 'asc',
      }
    });

    for (let reservation of reservations) {
      reservation.tour.photo = await getObjectSignedUrl(reservation.tour.photo)
    }

    const now = new Date();
    const updatedReservations = await Promise.all(
      reservations.map(async (reservation) => {
        if (reservation.status === 'BOOKED' && new Date(reservation.reservedAt) < now) {
          return prisma.reservation.update({
            where: { id: reservation.id },
            data: { status: 'DONE' }
          });
        }
        return reservation;
      })
    );

    res.status(200).json({
      status: 'success',
      message: 'reservation retrieved',
      data: { reservations: updatedReservations }
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

    const tour = await prisma.reservation.findUnique({
      where: {
        id: reservationId
      }
    });

    if (!tour) {
      return res.status(409).json({
        status: 'fail',
        message: 'reservation not exist'
      }); 
    }

    if (!isAdmin && tour.userId !== currentUserId) {
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

    await prisma.tour.update({
      where: {
        id: tour.tourId
      },
      data: {
        visitor: {
          decrement: tour.ticket
        }
      }
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