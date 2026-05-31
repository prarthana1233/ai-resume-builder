
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './models/Routes/authRoutes.js';
import resumeRoutes from './models/Routes/resumeRoutes.js';
import aiRoutes from './models/Routes/aiRoutes.js';
import feedbackRoutes from './models/Routes/feedbackRoutes.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/feedback', feedbackRoutes); 
app.get('/', (req, res) => {
  res.send('Backend Running');
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {

    console.log('MongoDB Connected');

    app.listen(5000, () => {
        console.log('Server running on port 5000');
    });

})
.catch((err) => {
    console.log(err);
});