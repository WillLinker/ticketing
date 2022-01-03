import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';

const createTicket = (title:string) => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price: 20 });
};

test('fetch a list of tickets', async () => {

  await createTicket('Dire Straits');
  await createTicket('Led Zeppelin');
  await createTicket('The Band');
  await createTicket('The Who');

  const resposne = await request(app).get(`/api/tickets`)
                          .send({ })
                          .expect(200);

  //console.log(ticketResposne.body);
  expect(resposne.body.length).toEqual(4);
  //console.log("get ticket completed!");
});