"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
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
            passwordHash: hashedPassword
        });
        const savedUser = await newUser.save();
        // Generate Token
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' });
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
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, message: 'User logged in successfully', token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Login failed', error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map