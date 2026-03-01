const mongoose = require('mongoose');

const placementDataSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    index: true
  },
  studentId: { type: String, index: true },
  name: { type: String, index: true },
  branch: { type: String, index: true },
  batch: { type: Number, index: true },
  companyName: { type: String, index: true },
  ctcLpa: { type: Number, index: true },
  offerType: { type: String, index: true },
  placementDate: { type: Date, index: true },
  status: {
    type: String,
    enum: ['Placed', 'Not Placed', 'Pending'],
    default: 'Pending',
    index: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PlacementData', placementDataSchema);
