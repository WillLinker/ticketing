import mongoose  from 'mongoose';
import request from 'supertest';
import { couldStartTrivia } from 'typescript';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

test('can only be accessed if the user is signed in',async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.statusCode).toEqual(401);
});

test('Returns and error if the ticket is not found.', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app).post('/api/orders')
                                     .set('Cookie', global.signin())
                                     .send({ ticketId })
                                     .expect(404); 
});

test('Returns and error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'asfasd',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
          .post('/api/orders')
          .set('Cookie', global.signin())
          .send({ ticketId: ticket.id })
          .expect(400);

});

test('Reserves the ticket', async () => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 });
  await ticket.save();

  await request(app)
          .post('/api/orders')
          .set('Cookie', global.signin())
          .send({ ticketId: ticket.id })
          .expect(201);
});

test('Need to add logic to publish the events', async () => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 });
  await ticket.save();

  await request(app)
          .post('/api/orders')
          .set('Cookie', global.signin())
          .send({ ticketId: ticket.id })
          .expect(201);
  
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  
})