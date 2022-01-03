import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

test('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`)
            .set('Cookie', global.signin())
            .send({ title: 'The Band', price: 225})
            .expect(404);
});

test('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`)
            .send({ title: 'The Band', price: 225})
            .expect(401);
});

test('returns a 401 if the user does not own the ticket', async () => {
  // Create a ticket
  const response = await request(app).post('/api/tickets')
                                    .set('Cookie', global.signin())
                                    .send({ title: 'The Who', price: 20 });
  // Edit the ticket
  const updated = await request(app).put(`/api/tickets/${response.body.id}`)
                                    .set('Cookie', global.signin())
                                    .send({ title: 'The Band', price: 55 })
                                    .expect(401);
//
});

test('returns a 400 if the user provides an invalid title or price', async () => {
  // Create a ticket
  const cookie = global.signin();
  const response = await request(app).post('/api/tickets')
                                        .set('Cookie', cookie)
                                        .send({ title: 'The Who', price: 20 });
  // Edit the ticket
  const updated = await request(app).put(`/api/tickets/${response.body.id}`)
                                    .set('Cookie', cookie)
                                    .send({ title: '', price: 55 })
                                    .expect(400);

  const updated2 = await request(app).put(`/api/tickets/${response.body.id}`)
                                    .set('Cookie', cookie)
                                    .send({ title: 'The Bandx', price: -10 })
                                    .expect(400);

});

test('updates the ticket with valid input', async () => {
  // Create a ticket
  const cookie = global.signin();
  const response = await request(app).post('/api/tickets')
                                        .set('Cookie', cookie)
                                        .send({ title: 'The Who', price: 20 });
  // Edit the ticket
  const updated = await request(app).put(`/api/tickets/${response.body.id}`)
                                    .set('Cookie', cookie)
                                    .send({ title: 'The Band', price: 55 })
                                    .expect(200);
  
  // Fetch the ticket to make sure it was updated.
  const ticketResposne = await request(app).get(`/api/tickets/${response.body.id}`)
                                    .send({ })
                                    .expect(200);
  //
  expect(ticketResposne.body.title).toEqual('The Band');
  expect(ticketResposne.body.price).toEqual(55);
});

test('publiishes and event', async () => {
  // Create a ticket
  const cookie = global.signin();
  const response = await request(app).post('/api/tickets')
                                        .set('Cookie', cookie)
                                        .send({ title: 'The Who', price: 20 });
  // Edit the ticket
  const updated = await request(app).put(`/api/tickets/${response.body.id}`)
                                    .set('Cookie', cookie)
                                    .send({ title: 'The Band', price: 55 })
                                    .expect(200);
  
  // Fetch the ticket to make sure it was updated.
  const ticketResposne = await request(app).get(`/api/tickets/${response.body.id}`)
                                    .send({ })
                                    .expect(200);
  //
  expect(ticketResposne.body.title).toEqual('The Band');
  expect(ticketResposne.body.price).toEqual(55);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

test('Reject updates if the ticket is reservered',async () => {
  
  const cookie = global.signin();
  const response = await request(app).post('/api/tickets')
                                        .set('Cookie', cookie)
                                        .send({ title: 'The Who', price: 20 });
  // Edit the ticket
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();
  // This should failed!
  const updated = await request(app).put(`/api/tickets/${response.body.id}`)
                                    .set('Cookie', cookie)
                                    .send({ title: 'The Band', price: 55 })
                                    .expect(400);
});