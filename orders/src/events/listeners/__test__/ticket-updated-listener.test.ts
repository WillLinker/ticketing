import mongoose from 'mongoose';
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from "@wmltickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { isCommaListExpression } from 'typescript';
import { Ticket } from '../../../models/ticket';


const setup = async () => {
  // Updated an instance of the Listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create an save a ticket.
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "The Who",
    price: 25.00
  });
  await ticket.save();

  // Create a fake data event
  const data:TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "Dire Straits",
    price: 100,
    userId: 'Will'
  }

  // Create a fake message object
  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, ticket };
}

//------------------------------------------------------------
test('find, updates and saves a ticket',async () => {
  const { listener, data, msg, ticket } = await setup();
  // Call the onMessage function with the data and message objects.
  await listener.onMessage(data, msg);

  // assertions to make sure a ticket was created.
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);

});

test('acks the message',async () => {
  const { listener, data, msg } = await setup();
  
  // Call the onMessage function with the data and message objects.
  await listener.onMessage(data, msg);

  // assertions to make sure ack is called.
  expect(msg.ack).toHaveBeenCalled();

});

test('Does not call ACK if events are out of order', async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version = 99;
  // Call the onMessage function with the data and message objects.
  try {
    await listener.onMessage(data, msg);
  }
  catch(err)
  {

  }
  // assertions to make sure has not ack is called.
  expect(msg.ack).not.toHaveBeenCalled();
});