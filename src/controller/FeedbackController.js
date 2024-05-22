const prisma = require('../db');

const updateRating = async (tourId) => {
  const feedbacks = await prisma.feedback.findMany({
    where: {
      tourId
    },
    select: {
      rate: true
    },
  });

  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rate, 0);
  const averageRating = feedbacks.length ? totalRating / feedbacks.length : 0;

  await prisma.tour.update({
    where: {
      id: tourId
    },
    data: {
      rating: averageRating
    },
  });
}

const createFeedback = async (req, res) => {
  try {
    const userId = req.userData.id;
    const tourId = req.params.id;

    const isTourExist = await prisma.tour.findUnique({
      where: {
        id: tourId
      }
    });

    if (!isTourExist) {
      return res.status(409).json({
        status: 'fail',
        message: 'tour not exist'
      }); 
    }

    const { text, rate } = req.body;

    if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
      return res.status(400).json({
        status: 'fail',
        message: 'rating must be an integer between 1 and 5'
      });
    }

    await prisma.feedback.create({
      data: {
        text,
        rate,
        userId,
        tourId,
      },
    });

    await updateRating(tourId);

    res.status(201).json({
      status: 'success',
      message: 'feedback created',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createFeedback };