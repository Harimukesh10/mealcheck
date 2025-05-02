import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt-ts';
import userModel from '../models/userModel';
// import logger from '../logger';
import { generateAccessToken, generateRefreshToken, removeRefreshTokenFromDB, saveRefreshTokenInDB, verifyRefreshToken } from '../utils/tokenUtils';


const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Check if user exists
      const user = await userModel.findOne({ username });
      if (!user) {
        res.status(400).json({ message: 'User not found. Please check the username and try again.' });
        return;
      }

      const accessToken = generateAccessToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());


      // Check if password is correct
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials. Please check your username and password and try again.' });
        // logger.error('Invalid credentials. Please check your username and password and try again.')
        return;
      }
      await saveRefreshTokenInDB(user._id.toString(), refreshToken);
      res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      // Generate token 
      res.status(200).json({ role: user.role, username: user.username });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      // logger.error(`Login error, ${error}`);
    }
  },

  register: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      // Check if user exists
      const existingUser = await userModel.findOne({ username });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists. Please use a different email address or username.' });
        return;
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Create new user
      await userModel.create({ ...req.body, password: hashedPassword });
      res.status(201).json({ message: 'Registration successful, Please login to continue'});
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      // logger.error(`Registration error, ${error}`);
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        res.sendStatus(204);
        return;
      }  
    
      // Remove refresh token from database
      await removeRefreshTokenFromDB(refreshToken);
    
      // Clear cookie
      res.clearCookie('refreshToken', { path: '/' });
      res.clearCookie('token', { path: '/' });
      res.sendStatus(204);
    } catch (error) {
      // logger.error(`logout error, ${error}`);
    }
  },
  
  refreshToken: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is required' });
        return;
      }

      const userId = await verifyRefreshToken(refreshToken);
      if (!userId) {
        res.status(403).json({ message: 'Your session has expired. Please login again.' });
        return;
      }
      const newAccessToken = generateAccessToken(userId);
      res.cookie('token', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.status(200).json({ messages: 'Token refreshed successfully' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      // logger.error(`Refresh token error, ${error}`);
    }
  }

  
};

export const { login, register, logout, refreshToken } = authController;
export default authController;