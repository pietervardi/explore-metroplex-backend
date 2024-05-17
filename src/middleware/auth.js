const jwt = require('jsonwebtoken');

const isAuthorized = (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization) {
    return res.status(401).json({
      status: 'fail',
      message: 'unauthorized access'
    });
  }

  const token = authorization.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  try {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 'fail',
          message: 'jwt expired'
        });
      }

      req.userData = decoded;
    });
  } catch(error) {
    return res.status(401).json({
      status: 'fail',
      message: error.message
    });
  }
  next();
}

module.exports = { isAuthorized };