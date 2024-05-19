const prisma = require('../db');
const jwt = require('jsonwebtoken');

const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;

    const user = await prisma.user.findFirst({
      where: {
        refreshToken
      }
    });
    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) return res.sendStatus(403);

      const payload = {
        id: decoded.id,
        name: decoded.name,
        username: decoded.username,
        email: decoded.email,
      }

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

      res.status(200).json({
        status: 'success',
        message: 'access token refreshed',
        data: {
          accessToken
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = refreshToken;