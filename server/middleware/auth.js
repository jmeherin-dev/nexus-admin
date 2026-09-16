import jwt from 'jsonwebtoken';

// ১. Token Authentication
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded; // payload-এ id, role থাকা নিশ্চিত করুন
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// ২. Admin Authorization Check
export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Admin resources only.' });
  }
};

export default authMiddleware;