import mongoose  from 'mongoose';
import request from 'supertest';
//import { couldStartTrivia } from 'typescript';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

const createTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title, price });
  await ticket.save();
  return ticket;
}

const createOrder = async () => {

}

test('can only be accessed if the user is signed in',async () => {
  const response = await request(app).get('/api/orders').send({});
  expect(response.statusCode).toEqual(401);
});

test('Returns all orders for a user.', async () => {
  // Create three tickets
  const ticket1 = await createTicket('The Band', 20);
  const ticket2 = await createTicket('The Who', 30);
  const ticket3 = await createTicket('Dire Straits', 40);

  // Create one order as user number 1 and two orders as Users number 2
  const userOne = global.signin();
  const userTwo = global.signin();
  
  const { body: order1 } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);
  const { body: order2 } = await request(app).post('/api/orders').set('Cookie', userTwo).send({ ticketId: ticket2.id }).expect(201);
  const { body: order3 } = await request(app).post('/api/orders').set('Cookie', userTwo).send({ ticketId: ticket3.id }).expect(201);

  // Fetch all orders for user number 2.

  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app).get('/api/orders').set('Cookie', userTwo).send({ }).expect(200);
  console.log(response.body);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id = order1.id);
  expect(response.body[0].ticket.id = ticket1.id);
  expect(response.body[1].id = order2.id);  
  expect(response.body[1].ticket.id = ticket2.id);
  
  for (let index = 0; index < response.body.length; index++) {
    let data = response.body[index];
    console.log(`[orders] Order: ${data.id}, Ticket: ${data.ticket.id} Title: ${data.ticket.title},`);
  }
});


it.todo('Need to add logic to publish the events');