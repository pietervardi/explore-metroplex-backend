const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const prisma = require('../db');
const generateAccessToken = require('../utils/generateAccessToken');

const register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
    } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: 'fail',
        message: 'invalid email format'
      });
    }

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
      email: user.email,
      role: user.role
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        refreshToken
      }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      status: 'success',
      message: 'login success',
      data: {
        token: accessToken
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
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found',
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

const updatePassword = async (req, res) => {
  try {
    const userId = req.userData.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found',
      });
    }

    const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'current password is incorrect',
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'password updated',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;

    const user = await prisma.user.findFirst({
      where: {
        refreshToken
      }
    });
    if (!user) {
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
      return res.sendStatus(204);
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        refreshToken: null
      }
    });

    res.clearCookie('refreshToken', { httpOnly: true });
    res.status(200).json({
      status: 'success',
      message: 'logout success'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { register, login, getOwnProfile, updatePassword, logout };