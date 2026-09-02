import { Router } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save to DB
    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword
    });
    const savedUser = await newUser.save();

    // Generate Token
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, message: 'User registered successfully', token, user: { id: savedUser._id, name: savedUser.name, email: savedUser.email } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, message: 'User logged in successfully', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
});

export default router;
