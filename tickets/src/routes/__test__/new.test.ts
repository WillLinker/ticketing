import request from 'supertest';
import { couldStartTrivia } from 'typescript';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for POST request',async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.statusCode).not.toEqual(404);
});

it('can only be accessed if the user is signed in',async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.statusCode).toEqual(401);
});

it('if the user is signed in that we do not get a 401',async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({}); 
  //console.debug(`http status: ${response.statusCode}`);
  expect(response.statusCode).not.toEqual(401);
});

it('returns an error if an invalid title is provided',async () => {
  const response = await request(app).post('/api/tickets')
                                     .set('Cookie', global.signin())
                                     .send({ title: '', price: 10}); 
  //console.debug(`http status: ${response.statusCode}`);
  expect(response.statusCode).toEqual(400);
  
  const response2 = await request(app).post('/api/tickets')
                                     .set('Cookie', global.signin())
                                     .send({ price: 10}); 
  //console.debug(`http status: ${response2.statusCode}`);
  expect(response2.statusCode).toEqual(400);
  
});

it('return an error if an invalid price is provided',async () => {
  
  const response = await request(app).post('/api/tickets')
                                     .set('Cookie', global.signin())
                                     .send({ title: 'The Who', price: -10}); 
  //console.debug(`http status: ${response.statusCode}`);
  expect(response.statusCode).toEqual(400);
  
  const response2 = await request(app).post('/api/tickets')
                                     .set('Cookie', global.signin())
                                     .send({ title: 'The Who' }); 
  //console.debug(`http status: ${response2.statusCode}`);
  expect(response2.statusCode).toEqual(400);

});

it('create a ticket with valid inputs',async () => {
  /*
   * How many records are in the ticket database.
   */
  let tickets = await Ticket.find({});  // There should be zero tickets!
  expect(tickets.length).toEqual(0);

  const response = await request(app).post('/api/tickets')
                                     .set('Cookie', global.signin())
                                     .send({ title: 'The Who', price: 20}); 
  //console.debug(`http status: ${response.statusCode}`);
  expect(response.statusCode).toEqual(201);
  
  tickets = await Ticket.find({});  // There should be one tickets!
  expect(tickets.length).toEqual(1); 
});

test('publishes an event', async () => {

  const response = await request(app).post('/api/tickets')
                                     .set('Cookie', global.signin())
                                     .send({ title: 'The Who', price: 20})
                                     .expect(201); 

  //console.log(natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
