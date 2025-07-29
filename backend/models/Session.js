const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionName: {
    type: String,
    default: 'Untitled Session',
  },
  chatHistory: [
    {
      role: { type: String, enum: ['user', 'ai'], required: true },
      message: String,
    }
  ],
  componentCode: {
    jsx: { type: String, default: '' },
    css: { type: String, default: '' },
  },
  uiState: {
    selectedElement: { type: String, default: null },
    properties: mongoose.Schema.Types.Mixed,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

sessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
