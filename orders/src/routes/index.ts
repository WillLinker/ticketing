import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@wmltickets/common';
//import { body } from 'express-validator';
import { Order, OrderStatus } from '../models/order';
//import { NotFoundError, BadRequestError } from '@wmltickets/common';
//import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res:Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket');
  res.send(orders)
});

export { router as indexOrderRouter };