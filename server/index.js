import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import securityRoutes from "./routes/security.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware - Updated CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Uploads static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/security", securityRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully 🎉'))
  .catch((err) => console.error('MongoDB Connection Error:', err.message));

app.get('/', (req, res) => {
  res.send('NexusAdmin API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});