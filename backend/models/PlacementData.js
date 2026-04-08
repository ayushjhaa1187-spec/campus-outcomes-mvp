const mongoose = require('mongoose');

const placementDataSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    index: true
  },
  studentId: String,
  name: String,
  branch: String,
  batch: Number,
  companyName: String,
  ctcLpa: Number,
  offerType: String,
  placementDate: Date,
  status: {
    type: String,
    enum: ['Placed', 'Not Placed', 'Pending'],
    default: 'Pending'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PlacementData', placementDataSchema);
