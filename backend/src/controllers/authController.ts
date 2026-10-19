import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { signToken } from '../utils/jwt.js';
import { recordAuditLog } from '../utils/audit.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, requiredRole } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your login information.',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your login information.',
      });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Contact the administration.',
      });
      return;
    }

    // Role-specific check if user is attempting to log into a specific portal
    if (requiredRole && user.role !== requiredRole) {
      res.status(403).json({
        success: false,
        message: `Access denied. This portal requires ${requiredRole} credentials.`,
      });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await recordAuditLog({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: 'LOGIN',
      module: 'AUTH',
      details: { role: user.role },
      req,
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        permissions: user.permissions,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during authentication.',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        phone: req.user.phone,
        permissions: req.user.permissions,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user) {
      await recordAuditLog({
        userId: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'LOGOUT',
        module: 'AUTH',
        req,
      });
    }

    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Logout failed.' });
  }
};

export const setupInitialFounder = async (req: Request, res: Response): Promise<void> => {
  try {
    const existingFounder = await User.findOne({ role: 'founder' });
    if (existingFounder) {
      res.status(403).json({
        success: false,
        message: 'Founder account has already been initialized. Public setup is disabled.',
      });
      return;
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Name, valid email, and secure password (minimum 8 characters) are required.',
      });
      return;
    }

    const founder = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: 'founder',
      status: 'active',
      permissions: ['all'],
    });

    await recordAuditLog({
      userId: founder._id,
      userEmail: founder.email,
      userRole: founder.role,
      action: 'FOUNDER_INITIALIZED',
      module: 'AUTH',
      req,
    });

    const token = signToken({
      userId: (founder._id as any).toString(),
      email: founder.email,
      role: founder.role,
    });

    res.status(201).json({
      success: true,
      message: 'Founder account created successfully.',
      token,
      user: {
        id: founder._id,
        name: founder.name,
        email: founder.email,
        role: founder.role,
      },
    });
  } catch (error: any) {
    console.error('Founder setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize founder account.',
    });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password (min 8 characters) are required.',
      });
      return;
    }

    const user = await User.findById(req.user!._id).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    await recordAuditLog({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: 'PASSWORD_CHANGED',
      module: 'AUTH',
      req,
    });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always respond with success to prevent account enumeration
    if (!user) {
      res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been prepared.',
      });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    await recordAuditLog({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: 'PASSWORD_RESET_REQUESTED',
      module: 'AUTH',
      req,
    });

    res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been prepared.',
      ...(process.env.NODE_ENV === 'development' && { devResetToken: resetToken }),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Password reset request failed.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Valid token and new password (min 8 characters) are required.',
      });
      return;
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
      usedAt: { $exists: false },
    });

    if (!resetRecord) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
      return;
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    resetRecord.usedAt = new Date();
    await resetRecord.save();

    await recordAuditLog({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: 'PASSWORD_RESET_COMPLETED',
      module: 'AUTH',
      req,
    });

    res.json({ success: true, message: 'Password reset successfully. You may now log in.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Password reset failed.' });
  }
};
