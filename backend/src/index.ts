import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import tripRoutes from './routes/tripRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});
// Routes
import contactRoutes from './routes/contactRoutes';
import shareRoutes from './routes/shareRoutes';
import aiRoutes from './routes/aiRoutes';
import userRoutes from './routes/userRoutes';
import cityRoutes from './routes/cityRoutes';
import adminRoutes from './routes/adminRoutes';
import globalActivityRoutes from './routes/globalActivityRoutes';
import { errorHandler } from './middleware/error.middleware';

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/shared', shareRoutes); // public and protected sharing
app.use('/api/cities', cityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/activities', globalActivityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Tripora API is running', database: 'connected', timestamp: new Date() });
});

app.use(errorHandler);

// Database connection & Server start
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
