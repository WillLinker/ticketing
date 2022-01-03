import mongoose from 'mongoose';
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { OrderStatus, ExpirationCompleteEvent } from '@wmltickets/common';

const setup = async () => {
  // Updated an instance of the Listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "The Who",
    price: 25.00
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "Will",
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  // Create a fake data event
  const data:ExpirationCompleteEvent['data'] = { orderId: order.id };

  // Create a fake message object
  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, ticket, order };
}

//------------------------------------------------------------
test('Updating the Order status to cancelled',async () => {
  const { listener, data, msg, ticket, order } = await setup();
  // Call the onMessage function with the data and message objects.
  await listener.onMessage(data, msg);

  // assertions to make sure a ticket was created.
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

test('Publish the OrderCancelled event', async () => {
  const { listener, data, msg, ticket, order } = await setup();
  // Call the onMessage function with the data and message objects.
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
});

test('acks the message',async () => {
  const { listener, data, msg, order } = await setup();
  
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

