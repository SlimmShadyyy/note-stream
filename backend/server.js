import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import aiRoutes from './routes/ai.routes.js';
import noteRoutes from './routes/notes.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- MOUNT ROUTES ---
app.use('/api', aiRoutes); 

app.use('/api/notes', noteRoutes); 

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});