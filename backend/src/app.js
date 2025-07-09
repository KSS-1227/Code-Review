import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/database.js";
import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { protect } from "./middleware/auth.js";

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet()); // Set security headers
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your production domain
    : ['http://localhost:5173', 'http://localhost:3000'], // Development origins
  credentials: true,
}));

// General rate limiting
app.use(generalLimiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Code Review API is running",
    timestamp: new Date().toISOString(),
  });
});

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes (require authentication)
app.use("/ai", protect, aiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

export default app;
