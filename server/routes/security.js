import express from 'express';
import bcrypt from 'bcryptjs';
import Session from '../models/Session.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// পাসওয়ার্ড পরিবর্তন
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// এক্টিভ সেশন লিস্ট
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id, isRevoked: false }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// সেশন লগআউট (Revoke Session)
router.delete('/sessions/:id', authMiddleware, async (req, res) => {
  try {
    await Session.findByIdAndUpdate(req.params.id, { isRevoked: true });
    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to revoke session' });
  }
});

// লগইন হিস্ট্রি
router.get('/login-history', authMiddleware, async (req, res) => {
  try {
    const history = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch login history' });
  }
});

export default router;