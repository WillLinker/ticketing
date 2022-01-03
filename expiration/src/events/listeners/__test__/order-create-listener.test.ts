import mongoose from 'mongoose';
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@wmltickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { Ticket } from '../../../model/ticket';
import { OperationCanceledException } from 'typescript';

const setup = async () => {
  // Updated an instance of the Listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create an save a ticket.
  const ticket = Ticket.build({ title: "The Who", price: 25.00, userId: "will" });
  await ticket.save();

  // Create a fake data event
  const data:OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'will',
    expiresAt: '1',
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
  };

  // Create a fake message object
  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, ticket };
}

//------------------------------------------------------------
test('sets the orderId of the ticket', async () => {
  const { listener, data, msg, ticket } = await setup();
  // Call the onMessage function with the data and message objects.
  await listener.onMessage(data, msg);

  // assertions to make sure a ticket was updated (reserved).
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);

});

test('acks the message',async () => {
  const { listener, data, msg } = await setup();
  
  // Call the onMessage function with the data and message objects.
  await listener.onMessage(data, msg);

  // assertions to make sure ack is called.
  expect(msg.ack).toHaveBeenCalled();

});

test('Publishes a ticket updated event',async () => {

  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  //{"id":"61d12f0482c0f2ef240a4d0e","price":25,"title":"The Who","userId":"will","orderId":"61d12f0482c0f2ef240a4d10","version":1}
  const ticketsUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(data.id).toEqual(ticketsUpdatedData.orderId);
  
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

