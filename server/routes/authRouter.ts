import { authMiddleware } from './../middleware/authMiddleware';
import { Router } from "express";
import { register, login, logout, refreshToken } from "../controllers/authController";

const authRouter = Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);
authRouter.route('/refresh-token').post(authMiddleware, refreshToken);

export default authRouter;