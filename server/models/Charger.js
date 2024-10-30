import mongoose from 'mongoose';

const chargerSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  inputVoltageRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  outputVoltage: {
    type: Number,
    required: true
  },
  maxOutputCurrent: {
    type: Number,
    required: true
  },
  efficiency: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Charger', chargerSchema);