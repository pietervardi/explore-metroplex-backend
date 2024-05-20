const isAdmin = (req, res, next) => {
  try {
    if (req.userData.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'fail',
        message: 'access forbidden: admin only'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = isAdmin;