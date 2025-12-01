const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['Web App', 'Mobile', 'ML', 'Blockchain', 'Desktop', 'Other'],
      default: 'Web App'
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
      default: 'Not Started'
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    },
    thumbnail: {
      type: String,
      default: ''
    },
    githubLink: {
      type: String,
      default: ''
    },
    liveLink: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      default: 'Unknown'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
