const mongoose = require('mongoose');

const placementDataSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  studentId: String,
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


// Compound indexes for typical college-level queries
placementDataSchema.index({ collegeId: 1, batch: 1 });
placementDataSchema.index({ collegeId: 1, branch: 1 });
placementDataSchema.index({ collegeId: 1, companyName: 1 });
placementDataSchema.index({ collegeId: 1, status: 1 });
placementDataSchema.index({ collegeId: 1, ctcLpa: -1 });

module.exports = mongoose.model('PlacementData', placementDataSchema);
