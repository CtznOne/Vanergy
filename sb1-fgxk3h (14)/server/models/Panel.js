import mongoose from 'mongoose';

const panelSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  watts: {
    type: Number,
    required: true
  },
  volts: {
    type: Number,
    required: true
  },
  amps: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Panel', panelSchema);