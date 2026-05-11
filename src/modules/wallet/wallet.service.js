import { Wallet } from './wallet.model.js';
import { ApiError } from '../../shared/utils/ApiError.js';

export const createWallet = async (userId, { currency }) => {
  const existing = await Wallet.findOne({ owner: userId });
  if (existing) throw new ApiError(409, 'Wallet already exists for this user');

  const wallet = await Wallet.create({ owner: userId, currency });
  return wallet;
};

export const getMyWallet = async (userId) => {
  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet) throw new ApiError(404, 'Wallet not found');
  return wallet;
};

export const getWalletById = async (walletId) => {
  const wallet = await Wallet.findById(walletId);
  if (!wallet) throw new ApiError(404, 'Wallet not found');
  return wallet;
};

export const setWalletStatus = async (walletId, status) => {
  const wallet = await Wallet.findById(walletId);
  if (!wallet) throw new ApiError(404, 'Wallet not found');

  if (wallet.status === 'closed') {
    throw new ApiError(400, 'Closed wallets cannot be modified');
  }

  wallet.status = status;
  await wallet.save(); // triggers optimistic lock check via __v
  return wallet;
};

// Used internally by transaction service — not exposed as API
export const assertWalletActive = (wallet) => {
  if (wallet.status === 'frozen') throw new ApiError(403, 'Wallet is frozen');
  if (wallet.status === 'closed') throw new ApiError(403, 'Wallet is closed');
};