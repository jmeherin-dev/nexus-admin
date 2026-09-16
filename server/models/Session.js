import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  device: { type: String, required: true },
  ip: { type: String, required: true },
  location: { type: String, default: 'Dhaka, BD' },
  status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
  isRevoked: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);