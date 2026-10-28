import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import founderRoutes from './routes/founderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Determine allowed CORS origins
const configuredOrigins = [
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : []),
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : []),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set(configuredOrigins));

// Dynamic CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, server-to-server, Render/Vercel health checkers, curl)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, '');

      // Check explicit allowed origins list
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // In non-production, allow any localhost/127.0.0.1 port
      if (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments if a vercel origin is configured
      if (origin.endsWith('.vercel.app') && allowedOrigins.some((o) => o.includes('.vercel.app'))) {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy blocked access for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Standard request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Static uploads directory (supports uploaded images)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Platform Health Check (standard endpoint for Render, cloud monitors, containers)
app.get('/health', (_req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const status = isDbConnected ? 'healthy' : 'degraded';
  res.status(isDbConnected ? 200 : 503).json({
    status,
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    service: 'WEENGINEERS TECH Enterprise API',
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Backwards-compatible /api/v1/health endpoint
app.get('/api/v1/health', (_req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'healthy' : 'degraded',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    service: 'WEENGINEERS TECH Enterprise API',
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// Apply rate limiting to all standard APIs
app.use('/api/', apiLimiter);

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/founder', founderRoutes);
app.use('/api/v1/uploads', uploadRoutes);

// 404 Handler for undefined API routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
  });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[WEENGINEERS Server] Listening on port ${PORT} (Environment: ${process.env.NODE_ENV || 'development'})`);
  console.log(`[WEENGINEERS Server] Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});

export default app;
