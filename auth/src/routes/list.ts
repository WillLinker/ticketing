import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user';
import { BadRequestError, currentUser, requireAuth } from '@wmltickets/common';

const router = express.Router();

router.get('/api/users/list',
                  currentUser,
                  requireAuth,
                  async (req: Request, res: Response) => {
                    const users = await User.find();
                    res.status(200).send({ currentUser: req.currentUser, users});
                  });

export {router as listRouter };