import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@wmltickets/common";
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'd',
    userId: 'Will',
    status: OrderStatus.Created,
    ticket: { id: 'a', price: 10 }
  };

  //@ts-ignore
  const msg: Message = { ack: jest.fn()};

  return  { listener, data, msg };
};

test('Replicates the order information', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

test('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});