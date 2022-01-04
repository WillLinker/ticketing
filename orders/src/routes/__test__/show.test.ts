import mongoose  from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

const createTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title, price });
  await ticket.save();
  return ticket;
}

test('can only be accessed if the user is signed in',async () => {
  const response = await request(app).get('/api/orders/000000000000').send({});
  expect(response.statusCode).toEqual(401);
});

test('Fetch a order for a user.', async () => {
  // Create three tickets
  const ticket1 = await createTicket('The Band', 20);

  // Create one order as user number 1 and two orders as Users number 2
  const userOne = global.signin();  
  const { body: order1 } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);

  // Fetch all order just created
  //console.log(`[fetching] OrderId: ${order1.id}`);
  //console.log(order1);

  const fetchedOrder = await request(app).get(`/api/orders/${order1.id}`).set('Cookie', userOne).send({ }).expect(200);
  expect(fetchedOrder.body.id = order1.id);
  expect(fetchedOrder.body.ticket.id = ticket1.id);
  
  let data = fetchedOrder.body;
  //console.log(`[fetched] Order: ${data.id}, Ticket: ${data.ticket.id} Title: ${data.ticket.title},`);

});


test('Fails when the user attempts to fetch an order that is not thiers', async () => {
  // Create three tickets
  const ticket1 = await createTicket('The Band', 20);

  // Create one order as user number 1 and two orders as Users number 2
  const userOne = global.signin();  
  const userTwo = global.signin();  
  const { body: order1 } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);
  const fetchedOrder = await request(app).get(`/api/orders/${order1.id}`).set('Cookie', userTwo).send({ }).expect(401);
});

it.todo('Need to add logic to publish the events');