const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  financialData: {
    totalBalance: {
      type: Number,
      default: 0
    },
    monthlyIncome: {
      type: Number,
      default: 0
    },
    monthlyExpenses: {
      type: Number,
      default: 0
    },
    goals: [{
      name: {
        type: String,
        required: true
      },
      targetAmount: {
        type: Number,
        required: true
      },
      targetDate: {
        type: Date,
        required: true
      },
      currentAmount: {
        type: Number,
        default: 0
      },
      recommendedMonthlySaving: {
        type: Number,
        default: 0
      }
    }],
    riskTolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate'
    },
    investmentHorizon: {
      type: Number,
      default: 5
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);