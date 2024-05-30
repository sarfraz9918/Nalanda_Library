// This file is not strictly necessary if you include all role middleware in authMiddleware.js.
// Keeping it for clarity and separation of concerns.

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
  
  exports.memberMiddleware = (req, res, next) => {
    if (req.user.role !== 'Member') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
  