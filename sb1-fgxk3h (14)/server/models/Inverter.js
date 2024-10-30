import mongoose from 'mongoose';

const inverterSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  watts: {
    type: Number,
    required: true
  },
  peakWatts: {
    type: Number,
    required: true
  },
  efficiency: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Inverter', inverterSchema);