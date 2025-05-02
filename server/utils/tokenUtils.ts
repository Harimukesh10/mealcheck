import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET || 'MANOFSTEEL', { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET || 'MANOFSTEEL', { expiresIn: '7d' });
};

export const saveRefreshTokenInDB = async (userId: string, refreshToken: string): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, { refreshToken });
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw new Error('Could not save refresh token');
  }
};

export const removeRefreshTokenFromDB = async (refreshToken: string): Promise<void> => {
  try {
    await User.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } });
  } catch (error) {
    console.error('Error removing refresh token:', error);
    throw new Error('Could not remove refresh token');
  }
};

export const verifyRefreshToken = (token: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'MANOFSTEEL', (err, decoded) => {
      if (err) {
        return reject(null);
      }
      resolve((decoded as any).id);
    });
  });
};