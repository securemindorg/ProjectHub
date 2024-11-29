// server/middlewares/checkInitialized.ts
import { Request, Response, NextFunction } from 'express';
import { fileStorage } from '../services/storage';

export const checkInitialized = (req: Request, res: Response, next: NextFunction) => {
  if (!fileStorage.isInitialized()) {
    return res.status(503).json({ error: 'Storage not initialized. Please complete setup first.' });
  }
  next();
};
