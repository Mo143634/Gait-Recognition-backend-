import User from '../user/user.model.js';
import Auth from './auth.model.js';
import { hashPassword, comparePassword, generateOTP } from '../../utils/encryption.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/generateToken.js';
import { sendOTPEmail } from '../../utils/sendEmail.js';
import { HTTP_STATUS } from '../../config/constants.js';

export class AuthService {
  async register(registerData) {
    const { email, password, firstName, lastName } = registerData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = HTTP_STATUS.CONFLICT;
      throw error;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
    });

    await user.save();

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create auth record
    const auth = new Auth({
      user: user._id,
      otp: {
        code: otp,
        expiresAt: otpExpiry,
        verified: false,
      },
    });

    await auth.save();

    // Send OTP to email
    await sendOTPEmail(email, otp);

    return {
      userId: user._id,
      email: user.email,
      message: 'User registered successfully. Please verify your OTP.',
    };
  }

  async verifyOTP(email, otp) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    const auth = await Auth.findOne({ user: user._id });
    if (!auth) {
      const error = new Error('Auth record not found');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Check if OTP is expired
    if (auth.otp.expiresAt < new Date()) {
      const error = new Error('OTP has expired');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    // Check if OTP is correct
    if (auth.otp.code !== otp) {
      const error = new Error('Invalid OTP');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    // Mark OTP as verified
    auth.otp.verified = true;
    await auth.save();

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    return {
      message: 'Email verified successfully',
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    // Check if user is verified
    if (!user.isVerified) {
      const error = new Error('Please verify your email first');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    // Update auth records
    const auth = await Auth.findOne({ user: user._id });
    if (auth) {
      auth.lastLoginAt = new Date();
      auth.loginAttempts.count = 0;
      await auth.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    if (auth) {
      auth.refreshTokens.push({ token: refreshToken });
      if (auth.refreshTokens.length > 5) {
        auth.refreshTokens.shift();
      }
      await auth.save();
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshAccessToken(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    const auth = await Auth.findOne({ user: user._id });
    if (!auth || !auth.refreshTokens.some(rt => rt.token === refreshToken)) {
      const error = new Error('Invalid refresh token');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    return {
      accessToken: newAccessToken,
    };
  }

  async logout(userId, refreshToken) {
    const auth = await Auth.findOne({ user: userId });
    if (auth) {
      auth.refreshTokens = auth.refreshTokens.filter(rt => rt.token !== refreshToken);
      await auth.save();
    }

    return {
      message: 'Logged out successfully',
    };
  }
}

export default new AuthService();
