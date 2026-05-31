import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../User.js';

const router = express.Router();

const otpStore = new Map();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Register ──
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error' });
  }
});

// ── Login ──
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Login error' });
  }
});

// ── Send OTP ──
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    console.log('Email config:', {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS ? '***set***' : 'NOT SET'
    });

    await transporter.sendMail({
      from: `"ResumeAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your ResumeAI Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f7ff; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #7c3aed; font-size: 28px; margin: 0;">ResumeAI</h1>
          </div>
          <div style="background: white; padding: 32px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(124,58,237,0.1);">
            <h2 style="color: #1e1b4b; margin-bottom: 8px;">Your Login Code</h2>
            <p style="color: #6b7280; margin-bottom: 24px;">Enter this code to log in to your account</p>
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 42px; font-weight: 800; letter-spacing: 12px; padding: 20px 32px; border-radius: 12px; display: inline-block;">
              ${otp}
            </div>
            <p style="color: #9ca3af; font-size: 13px; margin-top: 20px;">This code expires in <strong>10 minutes</strong></p>
            <p style="color: #9ca3af; font-size: 13px;">If you didn't request this, ignore this email.</p>
          </div>
        </div>
      `
    });

    console.log(`OTP sent to ${email}: ${otp}`);
    res.json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.log('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// ── Verify OTP ──
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);
    if (!stored) return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }
    if (stored.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    otpStore.delete(email);

    const user = await User.findOne({ email });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'OTP verified',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.log('Verify OTP error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

export default router;