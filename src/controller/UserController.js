const validator = require('validator');
const prisma = require('../db');

const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilePicture: true,
        role: true,
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'users retrieved',
      data: {
        users
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const currentUserId = req.userData.id;
    const isAdmin = req.userData.role === 'ADMIN';

    if (!isAdmin && currentUserId !== req.params.id) {
      return res.status(401).json({
        status: 'fail',
        message: 'unauthorized to update user'
      });
    }

    const {
      name,
      username,
      email,
      profilePicture,
      role,
    } = req.body;

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!isUserExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found'
      });
    }

    if (username) {
      const isUsernameExist = await prisma.user.findUnique({
        where: {
          username
        }
      });
  
      if (isUsernameExist && isUsernameExist.id !== req.params.id) {
        return res.status(409).json({
          status: 'fail',
          message: 'username already taken'
        }); 
      }
    }
    
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          status: 'fail',
          message: 'invalid email format'
        });
      }

      const isEmailExist = await prisma.user.findUnique({
        where: {
          email
        }
      });
  
      if (isEmailExist && isEmailExist.id !== req.params.id) {
        return res.status(409).json({
          status: 'fail',
          message: 'email already taken'
        }); 
      }
    }

    if (!isAdmin && role) {
      return res.status(401).json({
        status: 'fail',
        message: 'unauthorized to update user role'
      });
    }

    const user = await prisma.user.update({
      where: {
        id: req.params.id
      },
      data: {
        name,
        username,
        email,
        profilePicture,
        ...(isAdmin && { role }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilePicture: true,
        role: true,
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'user updated',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const currentUserId = req.userData.id;
    const isAdmin = req.userData.role === 'ADMIN';

    if (!isAdmin && currentUserId !== req.params.id) {
      return res.status(401).json({
        status: 'fail',
        message: 'unauthorized to delete user'
      });
    }

    const isUserExist = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!isUserExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found'
      });
    }

    await prisma.user.delete({
      where: {
        id: req.params.id
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'user deleted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUser, updateUser, deleteUser };