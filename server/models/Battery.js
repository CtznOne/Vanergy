import mongoose from 'mongoose';

const batterySchema = new mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  amphhours: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Flooded', 'AGM', 'Lithium']
  }
});

export default mongoose.model('Battery', batterySchema);