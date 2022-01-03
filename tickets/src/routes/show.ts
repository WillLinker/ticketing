import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotFoundError } from '@wmltickets/common';
import { Ticket } from '../model/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res:Response) => {
  //console.log("----------- get ticket ------------");
  const ticket = await Ticket.findById(req.params.id);
  
  if (!ticket) {
    //console.error(`Ticket id ${req.params.id} was not found!`);
    throw new NotFoundError();
  }
  //console.log(ticket);
  res.send(ticket);
});

export { router as showTicketRouter };
