import authService from './auth.service.js';
import { sendSuccess, sendError, sendCreated } from '../../utils/apiResponse.js';
import { HTTP_STATUS } from '../../config/constants.js';
import { asyncHandler } from '../../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return sendCreated(res, result, 'User registered successfully');
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOTP(email, otp);
  return sendSuccess(res, result, result.message);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return sendSuccess(res, result, 'Login successful', HTTP_STATUS.OK);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken);
  return sendSuccess(res, result, 'Token refreshed successfully');
});

export const logout = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { refreshToken } = req.body;
  const result = await authService.logout(userId, refreshToken);
  return sendSuccess(res, result, result.message);
});
