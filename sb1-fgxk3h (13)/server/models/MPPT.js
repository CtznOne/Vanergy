import mongoose from 'mongoose';

const mpptSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  maxVolts: {
    type: Number,
    required: true
  },
  maxAmps: {
    type: Number,
    required: true
  },
  maxWatts: {
    type: Number,
    required: true
  }
});

export default mongoose.model('MPPT', mpptSchema);