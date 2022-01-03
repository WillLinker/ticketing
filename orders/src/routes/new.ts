import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { OrderStatus, requireAuth, validateRequest } from '@wmltickets/common';
import { body } from 'express-validator';
import { NotFoundError, BadRequestError } from '@wmltickets/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher  } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPERATION_WINDOW_SECONDS = 60; //15 * 60; // 15 Minutes // TODO -- Fix this!!!!

router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input:string) => mongoose.Types.ObjectId.isValid(input))  // Validate it is a Mongo ID.
    .withMessage('TickdetId must be provided')
], validateRequest
, async (req: Request, res:Response) => {
  
  // Find the ticket the user is trying to order in the database.
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  // Make sure the ticket is not already reserved.
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError("Ticket is already reserved!");
  }

  // Calculate the experation date for the orders (Now + 15 minutes)
  const experation = new Date();
  experation.setSeconds(experation.getSeconds() + EXPERATION_WINDOW_SECONDS);

  // Build the order and save it to the database.
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: experation,
    ticket: ticket
  });
  await order.save();

  // Publish the Order created event.
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: { id: ticket.id, price: ticket.price},
    version: order.version
  });

  res.status(201).send(order);
});

export { router as createOrderRouter };