import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotFoundError } from '@wmltickets/common';
import { Ticket } from '../model/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res:Response) => {
  const tickets = await Ticket.find({ orderId: undefined });
  
  if (!tickets) {
    //console.error(`Ticket id ${req.params.id} was not found!`);
    throw new NotFoundError();
  }
  //console.log(ticket);
  res.send(tickets);
});

export { router as indexTicketRouter };