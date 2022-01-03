import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotAuthorizedError, NotFoundError, BadRequestError } from '@wmltickets/common';
import { Ticket } from '../model/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
              body('title').not().isEmpty().withMessage('Title is requried'),
              body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero!')
            ] 
            , validateRequest
            , async (req: Request, res: Response) => {
                const { title, price }= req.body;
                //console.warn(`**** Attempting to update ticket id: ${req.params.id}`);
                const ticket = await Ticket.findById(req.params.id);
                if (!ticket) {
                  throw new NotFoundError();
                }

                if (ticket.userId !== req.currentUser?.id) {
                  throw new NotAuthorizedError();
                }
                /*
                 * If there is an orderId then the ticket is reserved
                 */
                if (ticket.orderId) {
                  throw new BadRequestError('Ticket is reservered and cannot be edited!');
                }

                ticket.set({
                  title: req.body.title,
                  price: req.body.price
                });
                await ticket.save();
                await new TicketUpdatedPublisher(natsWrapper.client).publish({
                  id: ticket.id,
                  title: ticket.title,
                  price: ticket.price,
                  userId: ticket.userId,
                  version: ticket.version
                 });
                console.log("*** TicketUpdatedPublisher");
                res.send(ticket);
              }
            );

export { router as updateTicketRouter };