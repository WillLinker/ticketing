import express, {Request, Response}  from 'express';

import { currentUser } from '@wmltickets/common';
//import { requireAuth } from '../middlewares/require-auth';
import { User } from '../models/user';

const router = express.Router();

//router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
router.get('/api/users/currentuser', currentUser, (req, res) => {
      res.send({ currentUser: req.currentUser || null });
});

export {router as currentUserRouter };