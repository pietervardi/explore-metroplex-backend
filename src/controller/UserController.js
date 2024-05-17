const prisma = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
    } = req.body;

    const isUsernameExist = await prisma.user.findUnique({
      where: {
        username
      }
    });

    if (isUsernameExist) {
      return res.status(409).json({
        status: 'fail',
        message: 'username already exist'
      }); 
    }

    const isEmailExist = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (isEmailExist) {
      return res.status(409).json({
        status: 'fail',
        message: 'email already exist'
      }); 
    }

    const encodedName = encodeURIComponent(name);
    const generatedUIAvatar = `https://ui-avatars.com/api/?name=${encodedName}&background=random`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const register = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        profilePicture: generatedUIAvatar
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilePicture: true,
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'user registered',
      data: {
        user: register
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found'
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'password wrong'
      }); 
    }

    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
    }
    const secret = process.env.JWT_SECRET;
    const expiresIn = '1d';
    const token = jwt.sign(payload, secret, { expiresIn });

    res.status(200).json({
      status: 'success',
      message: 'login success',
      data: {
        token
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getOwnProfile = async (req, res) => {
  try {
    const userId = req.userData.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'profile retrieved',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilePicture: true,
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
    const {
      name,
      username,
      email,
      profilePicture,
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

    const user = await prisma.user.update({
      where: {
        id: req.params.id
      },
      data: {
        name,
        username,
        email,
        profilePicture,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profilePicture: true,
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

module.exports = { register, login, getOwnProfile, getAllUser, updateUser, deleteUser };