import express, { Express, json } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';

import { Limiter } from './middleware/RateLimiter';

import favouriteRouter from './routes/favouriteRouter';


dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(json());
app.use(cookieParser());


const db: string = process.env.MONGO_URI || 'mongodb://localhost:27017/mealapi_management';
mongoose.connect(db).then(() => console.log('MongoDB connected')).catch((err) => console.log(err));

// Routes
app.use(Limiter,authRouter);
app.use(userRouter);

app.use(favouriteRouter)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));