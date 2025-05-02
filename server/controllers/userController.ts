import { Request, Response } from "express";
import userModel from "../models/userModel";
import { JwtPayload } from "jsonwebtoken";

const UserController = {
  getUserDetails: async (req: Request, res: Response) => {
    try {
      const usercheck = req.user as JwtPayload;
      const userId:string = usercheck.id;
      const user = await userModel.findById(userId);
      res.status(200).json({ username: user?.username, email: user?.email, phone: user?.phone});
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  getpatients:async (req: Request, res: Response) => {
    try {
      const patient = await userModel.find({ role: 'patient' });
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const usercheck = req.user as JwtPayload;
      const userId:string = usercheck.id;
      const user = await userModel.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      res.status(200).json({ username: user?.username, email: user?.email, phone: user?.phone });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
};


export const { updateUser, getUserDetails } = UserController;
export default UserController;