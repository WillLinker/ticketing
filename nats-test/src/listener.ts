
import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
//import { TicketedCreatedListener } from './events/TicketedCreatedListener';
import { TicketedCreatedListener } from './events/TicketedCreatedListener';
const subject = 'ticket:created';
const queryGroup = 'orders-service-query-group';

const stan = nats.connect('ticketing'
                          , randomBytes(4).toString('hex')
                          , { url: 'http://localhost:4222' });

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => { console.log("NATS conneciton closed"); process.exit(); });

  new TicketedCreatedListener(stan).listen();
  
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());



