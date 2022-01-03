import mongoose from 'mongoose';
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@wmltickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../model/ticket';
import { OperationCanceledException } from 'typescript';
import { TicketUpdatedPublisher } from '../../publishers/ticket-updated-publisher';

const setup = async () => {
  // Updated an instance of the Listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create an save a ticket.
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ title: "The Who", price: 25.00, userId: "will" });
  ticket.set({ orderId });
  await ticket.save();

  // Create a fake data event
  const data:OrderCancelledEvent['data'] = {
                id: new mongoose.Types.ObjectId().toHexString(),
                version: 0,
                ticket: {
                    id: ticket.id
                }
              };

  // Create a fake message object
  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, ticket, orderId };
}

//------------------------------------------------------------
test('clear the orderId of the ticket when Cancelled', async () => {
  const { listener, data, msg, ticket, orderId } = await setup();
  // Call the onMessage function with the data and message objects.
  await listener.onMessage(data, msg);

  // assertions to make sure a ticket was updated (reserved).
  const updatedTicket = await Ticket.findById(ticket.id);
  console.log("updatedTicket!.orderId: " + updatedTicket!.orderId);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  //{"id":"61d12f0482c0f2ef240a4d0e","price":25,"title":"The Who","userId":"will","orderId":"61d12f0482c0f2ef240a4d10","version":1}
  // const ticketsUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  // expect(data.id).toEqual(ticketsUpdatedData.orderId);
  
  //console.log(natsWrapper.client.publish.mock.calls[0][1]);
  //console.log(natsWrapper.client.publish.mock.calls);
  /*
   *     [
   *       [
   *         'ticket:updated',
   *         '{"id":"61d12f0482c0f2ef240a4d0e","price":25,"title":"The Who","userId":"will","orderId":"61d12f0482c0f2ef240a4d10","version":1}',
   *         [Function]
   *       ]
   *     ]
   */
});

