const jwt = require('jsonwebtoken');
const secret_key="sarfraz1234";
exports.generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
