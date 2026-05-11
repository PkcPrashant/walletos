import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one wallet per user for now
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'], // DB-level safety net
    },
    currency: {
      type: String,
      default: 'AED',
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true, // uses __v for locking
  }
);

// Compound index — fast lookup by owner + status
walletSchema.index({ owner: 1, status: 1 });

export const Wallet = mongoose.model('Wallet', walletSchema);