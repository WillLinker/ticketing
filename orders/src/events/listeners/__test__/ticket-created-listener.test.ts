import mongoose from 'mongoose';
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from "@wmltickets/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { isCommaListExpression } from 'typescript';
import { Ticket } from '../../../models/ticket';


const setup = async () => {
  // Create an instance of the Listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data:TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "Dire Straits",
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // Create a fake message object
  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
}

test('creates and saves a ticket',async () => {
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data and message objects.
  await listener.onMessage(data, msg);

  // assertions to make sure a ticket was created.
  const ticket = await Ticket.findById(data.id);
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);

});

test('acks the message',async () => {
  const { listener, data, msg } = await setup();
  
  // Call the onMessage function with the data and message objects.
  await listener.onMessage(data, msg);

  // assertions to make sure ack is called.
  expect(msg.ack).toHaveBeenCalled();

});