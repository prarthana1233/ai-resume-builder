import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  resumeId: String,
  resumeName: String,
  rating: Number,
  ratingLabel: String,
  comment: String,
  createdAt: String,
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);