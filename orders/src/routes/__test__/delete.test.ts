import mongoose  from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const createTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title, price });
  await ticket.save();
  return ticket;
}

test('can only be accessed if the user is signed in',async () => {
  const response = await request(app).delete('/api/orders/000000000000').send({});
  expect(response.statusCode).toEqual(401);
});

test('delete order for a user.', async () => {
  // Create three tickets
  const ticket1 = await createTicket('The Band', 20);

  // Create one order as user number 1 and two orders as Users number 2
  const userOne = global.signin();  
  const { body: order1 } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);

  const deleteOrder = await request(app).delete(`/api/orders/${order1.id}`).set('Cookie', userOne).send({ }).expect(204);
  expect(deleteOrder.body.id = order1.id);
  expect(deleteOrder.body.ticket).toBeUndefined();
  
  let data = deleteOrder.body;
  console.log(`[delete] Order: ${data.id}, Status: ${data.status}`);

  const cancelledOrder = await request(app).get(`/api/orders/${order1.id}`).set('Cookie', userOne).send({ }).expect(200);
  console.log(cancelledOrder.body);
  expect(cancelledOrder.body.status).toEqual(OrderStatus.Cancelled);
 
});


test('Fails when the user attempts to delete an order that is not thiers', async () => {
  // Create three tickets
  const ticket1 = await createTicket('The Band', 20);

  // Create one order as user number 1 and two orders as Users number 2
  const userOne = global.signin();  
  const userTwo = global.signin();  
  const { body: order1 } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);
  const deleteOrder = await request(app).delete(`/api/orders/${order1.id}`).set('Cookie', userTwo).send({ }).expect(401);
});

test('Need to add logic to publish the events', async () => {
  // Create three tickets
  const ticket1 = await createTicket('The Band', 20);

  // Create one order as user number 1 and two orders as Users number 2
  const userOne = global.signin();  
  const userTwo = global.signin();  
  const { body: order1 } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);
  const deleteOrder = await request(app).delete(`/api/orders/${order1.id}`).set('Cookie', userTwo).send({ }).expect(401);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  //expect(natsWrapper.client.publish).not.toHaveBeenCalled();
});