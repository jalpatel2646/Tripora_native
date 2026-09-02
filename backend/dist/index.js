"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const tripRoutes_1 = __importDefault(require("./routes/tripRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});
// Routes
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const shareRoutes_1 = __importDefault(require("./routes/shareRoutes"));
const error_middleware_1 = require("./middleware/error.middleware");
app.use('/api/auth', authRoutes_1.default);
app.use('/api/trips', tripRoutes_1.default);
app.use('/api/contacts', contactRoutes_1.default);
app.use('/api/shared', shareRoutes_1.default); // public and protected sharing
// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Tripora API is running', database: 'connected', timestamp: new Date() });
});
app.use(error_middleware_1.errorHandler);
// Database connection & Server start
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});
//# sourceMappingURL=index.js.map