import * as walletService from './wallet.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';

export const createWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.createWallet(req.user.userId, req.validated.body);
  res.status(201).json(new ApiResponse(201, { wallet }, 'Wallet created'));
});

export const getMyWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getMyWallet(req.user.userId);
  res.json(new ApiResponse(200, { wallet }));
});

export const getWalletById = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWalletById(req.validated.params.id);
  res.json(new ApiResponse(200, { wallet }));
});

export const freezeWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.setWalletStatus(req.validated.params.id, 'frozen');
  res.json(new ApiResponse(200, { wallet }, 'Wallet frozen'));
});

export const unfreezeWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.setWalletStatus(req.validated.params.id, 'active');
  res.json(new ApiResponse(200, { wallet }, 'Wallet unfrozen'));
});

export const closeWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.setWalletStatus(req.validated.params.id, 'closed');
  res.json(new ApiResponse(200, { wallet }, 'Wallet closed'));
});