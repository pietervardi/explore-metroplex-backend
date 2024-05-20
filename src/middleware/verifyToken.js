const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.sendStatus(401);
  const token = authorization.split(' ')[1];

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.userData = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: error.message
    });
  }
}

module.exports = verifyToken;