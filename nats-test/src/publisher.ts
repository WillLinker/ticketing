/// <reference types="node" /> 
import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

//console.clear();

// const stan = nats.connect('ticketing', 'abc', { url: 'http://localhost:4222' });
// stan.on('connect', async () => {
//   const publisher = new TicketCreatedPublisher(stan);
//   try {
//     await publisher.publish({id: '456', title: 'The Rolling Stones', price: 250 });
//   }
//   catch(err) {
//     console.error(err);
//   }
// });
// stan.on('connect', () => {
//   console.log('Publisher connected to NATS');
  
//   stan.on('close', () => {
//     console.log("NATS conneciton closed");
//     process.exit();
//   });

// process.on('SIGINT', () => stan.close());
// process.on('SIGTERM', () => stan.close());
