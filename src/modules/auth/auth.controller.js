import * as authService from './auth.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.validated.body);
  res.status(201).json(new ApiResponse(201, { user }, 'Registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.validated.body);
  res
    .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, { user, accessToken }, 'Logged in'));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  const { accessToken, refreshToken } = await authService.refresh(token);
  res
    .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.userId);
  res
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, null, 'Logged out'));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, { user: req.user }));
});