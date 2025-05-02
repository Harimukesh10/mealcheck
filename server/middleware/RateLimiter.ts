import rateLimit from 'express-rate-limit';
import { Request, Response } from "express";


export const Limiter = rateLimit({
    windowMs: 3*60 * 1000, // 10 seconds
    limit: 20, // Limit each IP to 5 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req : Request, res :Response) => {
      res.status(429).send({
        message: "Too many requests, please try again later.",
      });
    }
  });