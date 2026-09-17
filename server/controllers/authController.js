import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Step-1 Login: Verify credentials and send OTP
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'NexusAdmin - Your 2FA Verification Code',
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>NexusAdmin Security Verification</h2>
        <p>Your 6-digit OTP code is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      </div>`,
    });

    if (error) {
      console.error('Resend Email Error:', error);
      return res.status(500).json({ message: 'Server error sending OTP' });
    }

    res.status(200).json({
      requireOTP: true,
      email: user.email,
      message: 'OTP sent to your email!',
    });
  } catch (error) {
    console.error('Login OTP Error:', error);
    res.status(500).json({ message: 'Server error sending OTP' });
  }
};

// 2. Step-2 Verify OTP and Return JWT Token
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'nexusadmin_super_secret_key_2026',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};