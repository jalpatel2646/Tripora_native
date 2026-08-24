"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';
// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Save to DB
        const newUser = new User_1.User({
            name,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        // Generate Token
        const token = jsonwebtoken_1.default.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, message: 'User registered successfully', token, user: { id: savedUser._id, name: savedUser.name, email: savedUser.email } });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, message: 'User logged in successfully', token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Login failed', error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map