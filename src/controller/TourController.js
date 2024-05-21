const prisma = require('../db');

const getAllTour = async (req, res) => {
  try {
    const { city } = req.query;
    const queryOptions = city ? {
      where: {
        city 
      },
      orderBy: {
        createdAt: 'asc',
      }
    } : {
      orderBy: {
        createdAt: 'asc',
      }
    };
    const tours = await prisma.tour.findMany(queryOptions);

    res.status(200).json({
      status: 'success',
      message: 'tours retrieved',
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTourById = async (req, res) => {
  try {
    const detailTour = await prisma.tour.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!detailTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'tour not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'tour retrieved',
      data: {
        detailTour
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTour = async (req, res) => {
  try {
    const {
      name, 
      city, 
      price, 
      description,
      address,
      map,
      photo,
    } = req.body;

    const tour = await prisma.tour.create({
      data: {
        name,
        city, 
        price, 
        description,
        address,
        map,
        photo,
      },
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
    });

    res.status(201).json({
      status: 'success',
      message: 'tour created',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTour = async (req, res) => {
  try {
    const {
      name, 
      city, 
      price, 
      description,
      address,
      map,
      photo,
    } = req.body;

    const isTourExist = await prisma.tour.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!isTourExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'tour not found'
      });
    }

    const tour = await prisma.tour.update({
      where: {
        id: req.params.id
      },
      data: {
        name,
        city, 
        price, 
        description,
        address,
        map,
        photo,
      },
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
    });

    res.status(200).json({
      status: 'success',
      message: 'tour updated',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    const isTourExist = await prisma.tour.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!isTourExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'tour not found'
      });
    }

    await prisma.tour.delete({
      where: {
        id: req.params.id
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'tour deleted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTour, getTourById, createTour, updateTour, deleteTour };