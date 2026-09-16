import 'dotenv/config'; // একদম উপরে ডটএনভি লোড হবে
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully 🎉'))
  .catch((err) => console.error('MongoDB Connection Error:', err.message));

// Test Route
app.get('/', (req, res) => {
  res.send('NexusAdmin API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});