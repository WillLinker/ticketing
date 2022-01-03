import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';

test('return 404 if ticket is not found.', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
                    .get(`/api/tickets/${id}`)
                    .send()
                    .expect(404);
});

test('return the ticket if found.', async () => {
  const title = 'The Who';
  const price = 20;
  //       "61cd0a094f881e66040fa6e5";
  let id = "000000000000000000000000";

  // Build the ticket that I am going to return
  const response = await request(app).post('/api/tickets')
                          .set('Cookie', global.signin())
                          .send({ title, price })
                          .expect(201); 
  //console.log("respone from creating a ticket:");
  //console.log(response.body);
  id = response.body.id;

  console.log(`Try to retrieve the ticket "${id}" now`);
  const ticketResposne = await request(app).get(`/api/tickets/${id}`)
                          .send({ })
                          .expect(200);
  console.log('Back from getting ticket, title: ' + ticketResposne.body.title);
  //console.log(ticketResposne.body);
  expect(ticketResposne.body.title).toEqual(title);
  expect(ticketResposne.body.price).toEqual(price);
  //console.log("get ticket completed!");
});