const crypto = require('crypto');
const prisma = require('../db');
const { getObjectSignedUrl, uploadImage, deleteImage } = require('../services/S3');

const generateImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const getAllTour = async (req, res) => {
  try {
    const { name, city, page = 1, limit = 100 } = req.query;

    const offset = (page - 1) * limit;

    const query = {
      skip: offset,
      take: parseInt(limit),
      where: {},
      orderBy: {
        rating: 'desc',
      },
      include: {
        feedbacks: {
          select: {
            id: true,
            text: true,
            rate: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
                profilePicture: true,
                role: true,
              }
            }
          }
        }
      }
    };

    if (name) {
      query.where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (city) {
      query.where.city = {
        contains: city,
        mode: 'insensitive',
      };
    }
    
    const tours = await prisma.tour.findMany(query);

    for (let tour of tours) {
      tour.photo = await getObjectSignedUrl(tour.photo);
    }

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
      },
      include: {
        feedbacks: {
          select: {
            id: true,
            text: true,
            rate: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
                profilePicture: true,
                role: true,
              }
            }
          }
        },
      }
    });

    if (!detailTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'tour not found'
      });
    }

    detailTour.photo = await getObjectSignedUrl(detailTour.photo)

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
      capacity,
      description,
      address,
      map,
    } = req.body;

    const imageName = `tours/${generateImageName()}-${req.file.originalname}`;
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const tour = await prisma.tour.create({
      data: {
        name,
        city, 
        price: parseInt(price), 
        capacity: parseInt(capacity),
        description,
        address,
        map,
        photo: imageName,
      },
      select: {
        id: true,
        name: true,
        city: true, 
        price: true, 
        capacity: true, 
        visitor: true, 
        description: true,
        address: true,
        map: true,
      }
    });

    await uploadImage(imageName, imageBuffer, mimeType);

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
      capacity, 
      description,
      address,
      map,
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

    let imageName;
    if (req.file) {
      await deleteImage(isTourExist.photo);

      imageName = `tours/${generateImageName()}-${req.file.originalname}`;
      const imageBuffer = req.file.buffer;
      const mimeType = req.file.mimetype;

      await uploadImage(imageName, imageBuffer, mimeType);
    }

    const data = {
      name,
      city, 
      description,
      address,
      map,
    };

    if (price) data.price = parseInt(price);
    if (capacity) data.capacity = parseInt(capacity);

    const tour = await prisma.tour.update({
      where: {
        id: req.params.id
      },
      data: {
        ...data,
        ...(imageName && { photo: imageName }),
      },
      select: {
        id: true,
        name: true,
        city: true, 
        price: true, 
        capacity: true, 
        visitor: true, 
        description: true,
        address: true,
        map: true,
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

    const tour = await prisma.tour.delete({
      where: {
        id: req.params.id
      }
    });

    await deleteImage(tour.photo)
    
    res.status(200).json({
      status: 'success',
      message: 'tour deleted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTour, getTourById, createTour, updateTour, deleteTour };